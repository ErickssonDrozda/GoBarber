import React, {
  createContext,
  useEffect,
  useCallback,
  useState,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextProps {
  user: object; //eslint-disable-line
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

interface AuthState {
  token: string;
    user: object; //eslint-disable-line
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC = ({ children }) => { //eslint-disable-line
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token[1] && user[1])
        setData({ token: token[1], user: JSON.parse(user[1]) });

      setLoading(false);
    }
    loadStorageData();
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setData({} as AuthState);
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', { email, password });
    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
