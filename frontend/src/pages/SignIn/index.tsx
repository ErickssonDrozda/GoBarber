import React, { useRef, useCallback } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import {
  Container, Content, Background, AnimationContainer,
} from './styles';
import imgLogo from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErrors';

import Button from '../../components/button/index';
import Input from '../../components/input/index';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
          formRef.current?.setErrors({});
          const schema = Yup.object().shape({
            email: Yup.string().required('Email is required').email('Please, type a valid email'),
            password: Yup.string().required('Password is required'),
          });
          await schema.validate(data, {
            abortEarly: false,
          });

          await signIn({
            email: data.email, password: data.password,
          });

          history.push('/dashboard');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErros(error);
        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Authentication failed',
        description: 'something went wrong. please, check your credentials.',
      });
    }
  }, [signIn, addToast, history]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={imgLogo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
            <Input name="password" icon={FiLock} type="password" placeholder="Password" />

            <Button type="submit">Login</Button>
            <Link to="/forgot-password">Forgot Password</Link>
          </Form>
          <Link to="/signup">
            <FiLogIn />
            Create Account
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
