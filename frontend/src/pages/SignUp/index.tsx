import React, { useCallback, useRef } from 'react';
import {
  FiArrowLeft, FiUser, FiMail, FiLock,
} from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import {
  Container, Content, Background, AnimationContainer,
} from './styles';
import imgLogo from '../../assets/logo.svg';
import getValidationErros from '../../utils/getValidationErrors';
import api from '../../services/api';

import Button from '../../components/button/index';
import Input from '../../components/input/index';

import { useToast } from '../../hooks/toast';

interface SignUpFormData{
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string().required('Email is required').email('Please, type a valid email'),
          password: Yup.string().min(6, 'Password must content 6 digits or more'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        addToast({
          type: 'success',
          title: 'Success',
          description: 'Your account has been successfully registered',
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
        title: 'Registration failed',
        description: 'something went wrong. please, check your credentials.',
      });
    }
  }, [addToast, history]);

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={imgLogo} alt="GoBarber" />
          <Form
            //   initialData={{
            //     name: 'Ericksson',
            //   }}
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <h1>Create Your Account !</h1>
            <Input name="name" icon={FiUser} type="text" placeholder="Name" />
            <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
            <Input name="password" icon={FiLock} type="password" placeholder="Password" />

            <Button type="submit">Create</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Back to login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
