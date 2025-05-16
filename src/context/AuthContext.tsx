
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Эффект для загрузки пользователя из localStorage при инициализации
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = getUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        // Независимо от результата, завершаем загрузку
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Имитация задержки сетевого запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - в реальном приложении это будет запрос к бэкенду
      const mockUser: User = {
        id: '1',
        name: 'Тестовый Пользователь',
        email: email,
        avatar: 'https://i.pravatar.cc/150?img=1',
      };
      
      // Сохраняем пользователя в состояние и localStorage
      setUser(mockUser);
      setIsAuthenticated(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Имитация задержки сетевого запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user registration - в реальном приложении это будет запрос к бэкенду
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        avatar: 'https://i.pravatar.cc/150?img=1',
      };
      
      // Сохраняем пользователя в состояние и localStorage
      setUser(mockUser);
      setIsAuthenticated(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    
    // Имитация небольшой задержки
    setTimeout(() => {
      setUser(null);
      setIsAuthenticated(false);
      removeUserFromStorage();
      
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });
      
      setIsLoading(false);
    }, 500);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setIsAuthenticated(true);
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
        isLoading,
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
