import React, { useRef, useCallback } from 'react';
import {
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { useAuth } from '../../hooks/auth';
import Button from '../../components/Button/index';
import Input from '../../components/Input/index';
import getValidationErros from '../../utils/getValidationErrors';
import api from '../../services/api';
import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;

  oldPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);

  const newPasswordInputRef = useRef<TextInput>(null);

  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const handleUpdateAvatar = useCallback(() => {
    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        const data = new FormData();

        data.append('avatar', {
          uri: source.uri,
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
        });

        api.patch('/users/avatar', data).then(responseChanges => {
          updateUser(responseChanges.data);
        });
      }
    });
  }, [updateUser, user.id]);

  const handleUpdateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({}); //eslint-disable-line
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .required('Email is required')
            .email('Please, type a valid email'),

          oldPassword: Yup.string(),
          newPassword: Yup.string().when('oldPassword', {
            is: val => !!val.lenght,
            then: Yup.string().required('New password is required'),
            otherwise: Yup.string(),
          }),
          passwordConfirmation: Yup.string()
            .when('oldPassword', {
              is: val => !!val.lenght,
              then: Yup.string().required('Confirmation password is required'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('newPassword'), undefined], 'Wrong combination'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, newPassword, oldPassword } = data;

        const requestSendData = {
          name,
          email,
          ...(oldPassword
            ? {
                password: newPassword,
                oldPassword,
              }
            : {}),
        };

        const responseApi = await api.put('/profile', requestSendData);

        updateUser(responseApi.data);

        Alert.alert(
          'Successfully updated',
          'your profile has been updated successfully',
        );
        navigation.goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErros(error);
          formRef.current?.setErrors(errors); //eslint-disable-line

          return;
        }

        Alert.alert(
          'Update failed',
          'something went wrong. please, try again later.',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatarUrl }} />
            </UserAvatarButton>

            <Title>My Profile</Title>
            <Form
              ref={formRef}
              onSubmit={handleUpdateProfile}
              initialData={user}
            >
              <Input
                onSubmitEditing={() => emailInputRef.current?.focus()}
                autoCapitalize="words"
                placeholder="Name"
                icon="user"
                name="name"
                returnKeyType="next"
              />
              <Input
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
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
                ref={oldPasswordInputRef}
                secureTextEntry
                placeholder="Currently Password"
                icon="lock"
                containerStyle={{ marginTop: 16 }}
                name="oldPassword"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => newPasswordInputRef.current?.focus() } //eslint-disable-line
              />
              <Input
                ref={newPasswordInputRef}
                secureTextEntry
                placeholder="New Password"
                icon="lock"
                name="newPassword"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordConfirmationInputRef.current?.focus()
                }//eslint-disable-line
              />
              <Input
                ref={passwordConfirmationInputRef}
                secureTextEntry
                placeholder="Password Confirmation"
                icon="lock"
                name="passwordConfirmation"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>
            <Button
              onPress={() => {
                formRef.current?.submitForm(); //eslint-disable-line
              }}
            >
              Check Changes
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
