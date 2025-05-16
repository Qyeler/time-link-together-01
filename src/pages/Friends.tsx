
import React, { useState } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { useSchedule } from '../context/ScheduleContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { UserPlus, UserMinus, UserX, User, Check, X } from 'lucide-react';
import { Friend, User as UserType } from '../types';

const Friends = () => {
  const { 
    friends, 
    allUsers, 
    currentUser, 
    sendFriendRequest, 
    acceptFriendRequest, 
    declineFriendRequest, 
    removeFriend 
  } = useSchedule();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Фильтруем друзей по статусу
  const acceptedFriends = friends.filter(friend => friend.status === 'accepted');
  const pendingRequests = friends.filter(friend => friend.status === 'pending');
  
  // Фильтруем всех пользователей для поиска
  const filteredUsers = allUsers.filter(user => {
    // Не показываем текущего пользователя и уже добавленных друзей
    if (user.id === currentUser?.id || friends.some(f => f.id === user.id)) {
      return false;
    }
    
    // Поиск по имени или email
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderFriendCard = (friend: Friend) => (
    <Card key={friend.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={friend.avatar} />
              <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{friend.name}</div>
              <div className="text-sm text-muted-foreground">{friend.email}</div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => removeFriend(friend.id)}
          >
            <UserMinus className="h-4 w-4 mr-2" />
            Удалить
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderRequestCard = (request: Friend) => (
    <Card key={request.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={request.avatar} />
              <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{request.name}</div>
              <div className="text-sm text-muted-foreground">{request.email}</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => acceptFriendRequest(request.id)}
            >
              <Check className="h-4 w-4 mr-2" />
              Принять
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => declineFriendRequest(request.id)}
            >
              <X className="h-4 w-4 mr-2" />
              Отклонить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderUserCard = (user: UserType) => (
    <Card key={user.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => sendFriendRequest(user.id)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Добавить
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Друзья</h1>
        
        <div className="mb-6">
          <Input 
            placeholder="Найти пользователей..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs defaultValue="friends">
          <TabsList>
            <TabsTrigger value="friends">
              Друзья ({acceptedFriends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Запросы ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="find">
              Найти друзей
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="mt-4">
            {acceptedFriends.length > 0 ? (
              acceptedFriends.map(renderFriendCard)
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                У вас пока нет друзей. Добавьте их на вкладке "Найти друзей".
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="requests" className="mt-4">
            {pendingRequests.length > 0 ? (
              pendingRequests.map(renderRequestCard)
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                У вас нет запросов на добавление в друзья.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="find" className="mt-4">
            {searchTerm && filteredUsers.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                Пользователи не найдены. Попробуйте изменить запрос.
              </div>
            ) : !searchTerm ? (
              <div className="text-center p-8 text-muted-foreground">
                Введите имя или email для поиска пользователей.
              </div>
            ) : (
              filteredUsers.map(renderUserCard)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Friends;
