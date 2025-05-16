
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { LogIn, UserPlus } from 'lucide-react';

interface AuthOverlayProps {
  onClose: () => void;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({ 
        title: "Ошибка входа", 
        description: "Пожалуйста, заполните все поля",
        variant: "destructive" 
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(email, password);
      onClose();
      toast({ 
        title: "Вход выполнен", 
        description: "Добро пожаловать!"
      });
    } catch (error) {
      toast({ 
        title: "Ошибка входа", 
        description: "Неверный email или пароль",
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({ 
        title: "Ошибка регистрации", 
        description: "Пожалуйста, заполните все поля",
        variant: "destructive" 
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({ 
        title: "Ошибка регистрации", 
        description: "Пароли не совпадают",
        variant: "destructive" 
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Combine first and last name
      const fullName = lastName ? `${name} ${lastName}` : name;
      await register(fullName, email, password);
      onClose();
      toast({ 
        title: "Регистрация выполнена", 
        description: "Аккаунт успешно создан"
      });
    } catch (error) {
      toast({ 
        title: "Ошибка регистрации", 
        description: "Не удалось создать аккаунт",
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Skip auth for now
  const handleSkip = () => {
    onClose();
    toast({ 
      title: "Гостевой режим", 
      description: "Вы можете пользоваться базовыми функциями календаря"
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        {activeTab === 'login' ? (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Вход</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Доступные учетные записи:<br />
                Логин: user1@example.com, Пароль: user1<br />
                Логин: user2@example.com, Пароль: user2<br />
                И т.д. вплоть до user10
              </div>
              <div>
                <Input 
                  type="text" 
                  placeholder="Email или логин (например, user1)" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md px-4 py-2"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Input 
                  type="password" 
                  placeholder="Введите пароль..." 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-md px-4 py-2"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex items-center text-sm justify-between">
                <span className="text-primary cursor-pointer hover:underline" onClick={() => setActiveTab('register')}>
                  Нет аккаунта?
                </span>
                <span className="text-primary cursor-pointer hover:underline">
                  Забыли пароль?
                </span>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-black text-white rounded-md py-2 transition hover:bg-black/80"
                disabled={isSubmitting}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Войти
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Регистрация</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Input 
                  type="text" 
                  placeholder="Введите ваше имя..." 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-md px-4 py-2"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Input 
                  type="text" 
                  placeholder="Введите вашу фамилию (необязательно)..." 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border rounded-md px-4 py-2"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Input 
                  type="email" 
                  placeholder="Введите ваш e-mail..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md px-4 py-2"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Input 
                  type="password" 
                  placeholder="Придумайте пароль..." 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-md px-4 py-2"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Input 
                  type="password" 
                  placeholder="Подтвердите пароль..." 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-md px-4 py-2"
                  disabled={isSubmitting}
                />
              </div>
              <div className="text-sm text-center">
                <span className="text-primary cursor-pointer hover:underline" onClick={() => setActiveTab('login')}>
                  Уже есть аккаунт?
                </span>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black text-white rounded-md py-2 transition hover:bg-black/80"
                disabled={isSubmitting}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Зарегистрироваться
              </Button>
            </form>
          </>
        )}
        
        <div className="mt-4 text-center">
          <button 
            onClick={handleSkip}
            className="text-gray-500 text-sm hover:underline"
          >
            Продолжить без регистрации
          </button>
        </div>
      </div>
    </div>
  );
};
