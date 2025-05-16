
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
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: () => {},
  switchUser: () => {},
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

// Generate 10 mock users for the application
const generateMockUsers = () => {
  const users: Record<string, User> = {};
  
  for (let i = 1; i <= 10; i++) {
    users[`user${i}`] = {
      id: `user${i}`,
      name: `Пользователь ${i}`,
      email: `user${i}@example.com`,
      avatar: `https://i.pravatar.cc/150?img=${i}`,
    };
  }
  
  return users;
};

// Mock users for demo
const mockUsers = generateMockUsers();

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Effect for auto-login from localStorage
  useEffect(() => {
    const loadUser = () => {
      try {
        // First check localStorage
        const storedUser = getUserFromStorage();
        
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          // No stored user, remain logged out
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if input is just 'userX' format
      let loginInput = email;
      if (!email.includes('@')) {
        loginInput = `${email}@example.com`;
      }
      
      // Find user by email
      let userId = '';
      for (const key in mockUsers) {
        if (mockUsers[key].email.toLowerCase() === loginInput.toLowerCase()) {
          userId = key;
          break;
        }
      }
      
      // If user wasn't found by email, try direct userX format
      if (!userId && email.startsWith('user') && /^user\d+$/.test(email)) {
        userId = email;
      }
      
      if (!userId || !mockUsers[userId]) {
        throw new Error('Пользователь не найден');
      }
      
      // In a real app, this would validate password with backend
      // For demo, we're just checking if password matches userId
      if (password !== userId) {
        throw new Error('Неверный пароль');
      }
      
      const foundUser = mockUsers[userId];
      
      // Save user to state and localStorage
      setUser(foundUser);
      setIsAuthenticated(true);
      saveUserToStorage(foundUser);
      
      toast({
        title: "Вход выполнен успешно",
        description: `Добро пожаловать, ${foundUser.name}!`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Проверьте ваши учетные данные и попробуйте снова.",
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
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if email already exists
      for (const key in mockUsers) {
        if (mockUsers[key].email.toLowerCase() === email.toLowerCase()) {
          throw new Error('Пользователь с таким email уже существует');
        }
      }
      
      // Create a new mock user
      const newUserId = `user${Date.now()}`;
      const mockUser: User = {
        id: newUserId,
        name: name,
        email: email,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      };
      
      // Add to mock users
      mockUsers[newUserId] = mockUser;
      
      // Save user to state and localStorage
      setUser(mockUser);
      setIsAuthenticated(true);
      saveUserToStorage(mockUser);
      
      toast({
        title: "Регистрация выполнена успешно",
        description: `Добро пожаловать, ${mockUser.name}!`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Registration error:', error);
      
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    
    // Clear user data
    setUser(null);
    setIsAuthenticated(false);
    removeUserFromStorage();
    
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из системы.",
    });
    
    setIsLoading(false);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setIsAuthenticated(true);
      saveUserToStorage(updatedUser);
      
      // Also update in mockUsers
      if (mockUsers[user.id]) {
        mockUsers[user.id] = updatedUser;
      }
      
      toast({
        title: "Профиль обновлен",
        description: "Ваш профиль был успешно обновлен",
      });
    }
  };
  
  const switchUser = (userId: string) => {
    setIsLoading(true);
    
    const newUser = mockUsers[userId];
    
    if (newUser) {
      setUser(newUser);
      setIsAuthenticated(true);
      saveUserToStorage(newUser);
      
      toast({
        title: "Пользователь изменен",
        description: `Вы вошли как ${newUser.name}`,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Пользователь не найден",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
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
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
