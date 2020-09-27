import React, { ButtonHTMLAttributes } from 'react';
import Loader from 'react-loader-spinner';
import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean,
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? (
      <Loader type="TailSpin" color="#312E38" height={30} width={30} />
    ) : children}
  </Container>
);

export default Button;
