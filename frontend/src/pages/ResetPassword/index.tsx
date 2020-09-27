import React, { useRef, useCallback } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useLocation, useHistory } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import {
  Container, Content, Background, AnimationContainer,
} from './styles';
import imgLogo from '../../assets/logo.svg';
import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErrors';

import Button from '../../components/button/index';
import Input from '../../components/input/index';
import api from '../../services/api';

interface ResetPasswordFormData {
    password: string;
    passwordConfirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const location = useLocation();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
          formRef.current?.setErrors({});
          const schema = Yup.object().shape({
            password: Yup.string().required('Password is required'),
            passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), undefined], 'Password must match'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          const { password, passwordConfirmation } = data;

          const token = location.search.replace('?token=', '');

          if (!token) {
            throw new Error();
          }

          await api.post('/password/reset', {
            password,
            passwordConfirmation,
            token,
          });

          history.push('/');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErros(error);
        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Error to tried change the password',
        description: 'something went wrong. please, try later.',
      });
    }
  }, [addToast, history, location]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={imgLogo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Reset Password</h1>
            <Input name="password" icon={FiLock} type="password" placeholder="New Password" />

            <Input name="passwordConfirmation" icon={FiLock} type="password" placeholder="Password Confirmation" />

            <Button type="submit">Change Password</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
