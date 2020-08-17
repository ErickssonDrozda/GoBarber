import React, { useRef, useCallback } from 'react';
import {
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import logoImg from '../../assets/logo.png';
import Button from '../../components/Button/index';
import Input from '../../components/Input/index';
import getValidationErros from '../../utils/getValidationErrors';
import api from '../../services/api';
import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({}); //eslint-disable-line
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .required('Email is required')
            .email('Please, type a valid email'),
          password: Yup.string().min(
            6,
            'Password must content 6 digits or more',
          ),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        console.log('1');

        await api.post('/users', data);

        console.log('2');

        Alert.alert(
          'Successfully registered',
          'Now you can login on application',
        );
        console.log('3');
        navigation.goBack();
        console.log('4');
      } catch (error) {
        console.log(error);
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErros(error);
          formRef.current?.setErrors(errors); //eslint-disable-line

          return;
        }

        Alert.alert(
          'Registration failed',
          'something went wrong. please, check your credentials.',
        );
      }
    },
    [navigation],
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

            <Title>Create Your Account</Title>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                onSubmitEditing={() => emailInputRef.current?.focus()}
                autoCapitalize="words"
                placeholder="Name"
                icon="user"
                name="name"
                returnKeyType="next"
              />
              <Input
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                ref={emailInputRef}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="E-mail"
                icon="mail"
                name="email"
                returnKeyType="next"
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                placeholder="Password"
                icon="lock"
                name="password"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm() } //eslint-disable-line
              />
            </Form>
            <Button
              onPress={() => {
                formRef.current?.submitForm(); //eslint-disable-line
              }}
            >
              Create
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#FFF" />
        <BackToSignInText>Back to Login</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
