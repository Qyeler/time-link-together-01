
import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // For demo purposes, we'll use a mock user
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    const mockUser: User = {
      id: '1',
      name: 'Тестовый Пользователь',
      email: email,
      avatar: 'https://i.pravatar.cc/150?img=1',
    };
    setUser(mockUser);
    toast({
      title: "Вход выполнен успешно",
      description: `Добро пожаловать, ${mockUser.name}!`,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call
    const mockUser: User = {
      id: '1',
      name: name,
      email: email,
      avatar: 'https://i.pravatar.cc/150?img=1',
    };
    setUser(mockUser);
    toast({
      title: "Регистрация выполнена успешно",
      description: `Добро пожаловать, ${name}!`,
    });
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      setUser({...user, ...userData});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
