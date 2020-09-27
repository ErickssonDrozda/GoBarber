import React, { useRef, useCallback, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import {
  Container, Content, Background, AnimationContainer,
} from './styles';
import imgLogo from '../../assets/logo.svg';
import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErrors';

import Button from '../../components/button/index';
import Input from '../../components/input/index';
import api from '../../services/api';

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  //   const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('Email is required').email('Please, type a valid email'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      await api.post('/password/forgot', {
        email: data.email,
      });
      addToast({
        type: 'success',
        title: 'Email recovery has been sent',
        description: 'Please, follow the instructions passed on email.',
      });

      //   await signIn({
      //     email: data.email, password: data.password,
      //   });

      //   history.push('/dashboard');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErros(error);
        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Authentication failed',
        description: 'something went wrong. please, try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={imgLogo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recover Password</h1>
            <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />

            <Button loading={loading} type="submit">Recover</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Back to login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
