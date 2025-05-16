
import React, { createContext, useContext, useState, useEffect } from 'react';
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

// Helper function to store user data in localStorage
const saveUserToStorage = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Helper function to retrieve user data from localStorage
const getUserFromStorage = (): User | null => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
};

// Helper function to remove user data from localStorage
const removeUserFromStorage = () => {
  localStorage.removeItem('user');
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getUserFromStorage());

  // Update authentication state when user changes
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Mock user data - in a real app, this would verify credentials with a backend
      const mockUser: User = {
        id: '1',
        name: 'Тестовый Пользователь',
        email: email,
        avatar: 'https://i.pravatar.cc/150?img=1',
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      saveUserToStorage(mockUser);
      
      toast({
        title: "Вход выполнен успешно",
        description: `Добро пожаловать, ${mockUser.name}!`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Ошибка входа",
        description: "Проверьте ваши учетные данные и попробуйте снова.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Mock user registration - in a real app, this would create a user in a backend
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        avatar: 'https://i.pravatar.cc/150?img=1',
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      saveUserToStorage(mockUser);
      
      toast({
        title: "Регистрация выполнена успешно",
        description: `Добро пожаловать, ${name}!`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Ошибка регистрации",
        description: "Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const logout = () => {
    setUser(null);
    removeUserFromStorage();
    
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
      
      toast({
        title: "Профиль обновлен",
        description: "Ваш профиль был успешно обновлен",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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
