import React from 'react';

import { AuthProvider } from './auth';

// eslint-disable-next-line
const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AppProvider;
