import React, {
  createContext, useCallback, useState, useContext,
} from 'react';
import api from '../services/api';

interface User{
    id: string;
    avatarUrl: string;
    email: string;
    name: string;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextProps {
    user: User; //eslint-disable-line
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
    updateUser(user: User): void;
}

interface AuthState {
    token: string;
    user: User; //eslint-disable-line
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);

  return context;
}

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', { email, password });
    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const updateUser = useCallback((user: User) => {
    const { token } = data;
    setData({
      token,
      user,
    });

    localStorage.setItem('@GoBarber:user', JSON.stringify(user));
  }, [setData, data]);

  return (
    <AuthContext.Provider value={{
      user: data.user, signIn, signOut, updateUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};
