import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import enAU from 'date-fns/locale/en-AU';

import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  const routeParams = params as RouteParams;

  const handleOkPressed = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard',
        },
      ],
      index: 0,
    });
  }, [reset]);

  const formattedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', day ' dd ', ' MMMM ' of ' yyyy ' on ' HH:mm ' oClock' ",
      { locale: enAU },
    );
  }, [routeParams]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Scheduling completed</Title>
      <Description>{formattedDate}</Description>

      <OkButton onPress={handleOkPressed}>
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
