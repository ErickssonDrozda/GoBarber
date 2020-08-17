import React, { useCallback, useRef } from 'react';
import {
  Image,
  ScrollView,
  View,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useNavigation } from '@react-navigation/native'; //eslint-disable-line
import logoImg from '../../assets/logo.png';
import Button from '../../components/Button/index';
import Input from '../../components/Input/index';
import { useAuth } from '../../hooks/auth';
import getValidationErros from '../../utils/getValidationErrors';

import {
  Container,
  Title,
  CreateAccountButton,
  CreateAccountButtonText,
  ForgotPasswordText,
  ForgotPassword,
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const { signIn } = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({}); //eslint-disable-line
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email is required')
            .email('Please, type a valid email'),
          password: Yup.string().required('Password is required'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        // history.push('/dashborad');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErros(error);
          formRef.current?.setErrors(errors); //eslint-disable-line

          return;
        }

        Alert.alert(
          'Authentication failed',
          'something went wrong. please, check your credentials.',
        );
      }
    },
    [signIn],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />

            <Title>Login</Title>
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="E-mail"
                icon="mail"
                name="email"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus(); //eslint-disable-line
                }}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {formRef.current?.submitForm()}} //eslint-disable-line
                placeholder="Password"
                icon="lock"
                name="password"
              />
            </Form>
            <Button
              onPress={() => {
                  formRef.current?.submitForm(); //eslint-disable-line
              }}
            >
              Go
            </Button>

            <View>
              <ForgotPassword
                onPress={() => {
                  console.log('password');
                }}
              >
                <ForgotPasswordText>Forgot Password</ForgotPasswordText>
              </ForgotPassword>
            </View>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Create Account</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
