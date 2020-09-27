import React, { useCallback, useRef, ChangeEvent } from 'react';
import {
  FiUser, FiMail, FiLock, FiCamera, FiArrowLeft,
} from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import {
  Container, Content, AvatarInput,
} from './styles';
import getValidationErros from '../../utils/getValidationErrors';
import api from '../../services/api';

import Button from '../../components/button/index';
import Input from '../../components/input/index';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData{
    name: string;
    email: string;

    oldPassword: string;
    newPassword: string;
    passwordConfirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string().required('Email is required').email('Please, type a valid email'),

          oldPassword: Yup.string(),
          newPassword: Yup.string().when('oldPassword', {
            is: (val) => !!val.lenght,
            then: Yup.string().required('New password is required'),
            otherwise: Yup.string(),
          }),
          passwordConfirmation: Yup.string().when('oldPassword', {
            is: (val) => !!val.lenght,
            then: Yup.string().required('Confirmation password is required'),
            otherwise: Yup.string(),
          }).oneOf([Yup.ref('newPassword'), undefined], 'Wrong combination'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name, email, newPassword, oldPassword,
        } = data;

        const requestSendData = {
          name,
          email,
          ...(oldPassword ? {
            password: newPassword,
            oldPassword,
          } : {}),
        };

        const responseApi = await api.put('/profile', requestSendData);

        updateUser(responseApi.data);

        addToast({
          type: 'success',
          title: 'Success',
          description: 'Your account has been successfully updated',
        });

        history.push('/dashboard');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErros(error);
            formRef.current?.setErrors(errors);

            return;
      }

      let description = '';

      if (error.request.responseText === '{"status":"error","message":"Email Address already used"}') {
        description = 'This email already used. please, try other.';
      }

      addToast({
        type: 'error',
        title: 'Update failed',
        description: description || 'something went wrong. please, check your credentials.',
      });
    }
  }, [addToast, history]);

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = new FormData();

      data.append('avatar', e.target.files[0]);
      api.patch('/users/avatar', data).then((response) => {
        updateUser(response.data);
        addToast({
          type: 'success',
          title: 'Avatar has been changed!',
        });
      });
    }
  }, [addToast, updateUser]);

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <AvatarInput>
            <img src={user.avatarUrl} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>

          </AvatarInput>

          <h1>My Profile</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="Name" />
          <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />

          <Input containerStyle={{ marginTop: 24 }} name="oldPassword" icon={FiLock} type="password" placeholder="Currently password" />
          <Input name="newPassword" icon={FiLock} type="password" placeholder="New password" />
          <Input name="passwordConfirmation" icon={FiLock} type="password" placeholder="Confirm new password" />

          <Button type="submit">Confirm Changes</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
