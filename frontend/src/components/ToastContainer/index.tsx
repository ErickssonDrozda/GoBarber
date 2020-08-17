import React from 'react';
import { useTransition } from 'react-spring';
import { Container } from './styles';
import Toast from './Toast/index';
import { ToastMessage } from '../../hooks/toast';

interface toastContainerProps{
    messages: ToastMessage[];
}

const ToastContainer: React.FC<toastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(messages, (message) => message.id,
    {
      from: { right: '-120%', opacity: 0, transform: 'rotateZ(0deg)' }, enter: { right: '0%', opacity: 1, transform: 'rotateZ(360deg)' }, leave: { right: '-120%', opacity: 0, transform: 'rotateZ(0deg)' },
    });
  return (
    <Container>
      {
          messagesWithTransitions.map(({ item, key, props }) => (
            <Toast key={key} style={props} message={item} />
          ))
      }
    </Container>
  );
};

export default ToastContainer;
