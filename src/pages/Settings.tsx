
import React, { useState } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../context/AuthContext';
import { toast } from "../hooks/use-toast";
import { LogOut } from 'lucide-react';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Split the name into first and last name if available
  React.useEffect(() => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length > 1) {
        setName(nameParts[0]);
        setLastName(nameParts.slice(1).join(' '));
      } else {
        setName(user.name);
      }
    }
  }, [user]);
  
  const handleUpdateProfile = () => {
    if (!name) {
      toast({
        title: "Ошибка",
        description: "Имя не может быть пустым",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Combine first and last name
    const fullName = lastName ? `${name} ${lastName}` : name;
    
    updateProfile({
      name: fullName,
      email: email
    });
    
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные были успешно обновлены"
    });
    
    setIsSubmitting(false);
  };
  
  const handleLogout = () => {
    logout();
    
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из системы"
    });
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto max-w-3xl py-6">
        <h1 className="text-3xl font-bold mb-8">Настройки профиля</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Аватар</CardTitle>
                <CardDescription>
                  Ваше изображение профиля
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <Button className="mt-4" variant="outline">
                  Изменить фото
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
                <CardDescription>
                  Обновите вашу личную информацию
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">Имя</label>
                    <Input 
                      id="firstName" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Введите ваше имя" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Фамилия</label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Введите вашу фамилию" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com" 
                    disabled 
                  />
                  <p className="text-sm text-muted-foreground">
                    Email не может быть изменен.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleUpdateProfile}
                  disabled={isSubmitting}
                >
                  Сохранить изменения
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Аккаунт</CardTitle>
                <CardDescription>
                  Управление вашим аккаунтом
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium">Выход из аккаунта</h3>
                      <p className="text-sm text-muted-foreground">
                        Выйти из текущего аккаунта
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium">Данные приложения</h3>
                      <p className="text-sm text-muted-foreground">
                        Удалить все локальные данные приложения
                      </p>
                    </div>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        localStorage.clear();
                        toast({
                          title: "Данные очищены",
                          description: "Все локальные данные приложения удалены"
                        });
                      }}
                    >
                      Очистить данные
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
