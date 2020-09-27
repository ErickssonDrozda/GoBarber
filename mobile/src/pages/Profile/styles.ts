import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  padding: 0 30px ${Platform.OS === 'android' ? 160 : 40}px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 25px;
`;

export const Title = styled.Text`
  font-size: 25px;
  color: #f4ede8;
  font-family: 'Roboto-Medium';
  margin: 24px 0;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 10px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;

  border-radius: 98px;
  align-self: center;
`;
