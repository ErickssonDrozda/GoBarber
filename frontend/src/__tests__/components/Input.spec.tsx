import React from 'react';
import {
  fireEvent, getByTestId, render, waitFor,
} from '@testing-library/react';

import { FiMail } from 'react-icons/fi';
import Input from '../../components/input/index';
import { Container } from '../../components/input/styles';

jest.mock('@unform/core', () => ({
  useField() {
    return {
      fieldName: 'email',
      defaultValue: '',
      error: '',
      registerField: jest.fn(),
    };
  },
}));

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(<Input name="email" icon={FiMail} type="text" placeholder="E-mail" />);

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  //   it('should render highlight on input focus', async () => {
  //     // const container = getExampleDOM();
  //     const { getByPlaceholderText } = render(<Input name="email" icon={FiMail} type="text" placeholder="E-mail" />);

  //     const inputElement = getByPlaceholderText('E-mail');
  //     const containerElement = getByTestId('inputContainer');

  //     fireEvent.focus(inputElement);

//     await waitFor(() => {
//       expect(containerElement).toHaveStyle('border-color: #ff9000;');
//       expect(containerElement).toHaveStyle('color: #ff9000;');
//     });
//   });
});
