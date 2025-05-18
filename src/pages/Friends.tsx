
import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Search, UserPlus, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSchedule } from '../context/ScheduleContext';
import { Friend, User } from '../types';
import { toast } from "@/hooks/use-toast";

const Friends = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    friends, 
    allUsers, 
    addFriend, 
    acceptFriend, 
    rejectFriend, 
    removeFriend, 
    hasFriendRequest,
    getFriendRequests 
  } = useSchedule();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Filter friends by status and belonging to current user
  const acceptedFriends = friends.filter((friend) => 
    friend.status === 'accepted' && 
    (friend.addedBy === user?.id || friend.toUserId === user?.id)
  );
  
  // Get pending friend requests for current user
  const pendingFriends = friends.filter((friend) => 
    friend.status === 'pending' && 
    // Only requests sent to current user
    (friend.toUserId === user?.id)
  );
  
  // Search for users by name or email
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Пустой запрос",
        description: "Введите имя или email для поиска",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    // In a real app this would be an API call
    // For demo, simulate search with delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };
  
  // Search results - now includes email search
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || !user) return [];
    
    // Filter based on search query (name or email)
    const results = allUsers.filter(searchUser => 
      searchUser.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (searchUser.email && searchUser.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Exclude current user and already added friends
    return results.filter(result => 
      result.id !== user.id && 
      !acceptedFriends.some(friend => friend.id === result.id || friend.toUserId === result.id)
    );
  }, [searchQuery, acceptedFriends, user, allUsers]);
  
  const handleAddFriend = (friendToAdd: User) => {
    if (user) {
      addFriend({
        ...friendToAdd as Friend,
        addedBy: user.id,
        toUserId: friendToAdd.id
      });
    }
  };
  
  const handleAcceptFriend = (friendId: string) => {
    acceptFriend(friendId);
  };
  
  const handleRejectFriend = (friendId: string) => {
    rejectFriend(friendId);
  };
  
  const handleRemoveFriend = (friendId: string) => {
    removeFriend(friendId);
  };

  // Check if a friend request already exists for this user
  const isPendingRequest = (userId: string) => {
    return friends.some(friend => 
      (friend.id === userId || friend.toUserId === userId) && 
      friend.status === 'pending' && 
      friend.addedBy === user?.id
    );
  };
  
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-3xl py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Требуется авторизация</h2>
          <p className="mb-6">
            Для доступа к этой странице необходимо войти в аккаунт.
          </p>
          <Button>Войти</Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl py-6 overflow-y-auto max-h-[calc(100vh-80px)]">
        <h1 className="text-3xl font-bold mb-8">Друзья и контакты</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Найти друзей</CardTitle>
            <CardDescription>
              Поиск по имени или email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Введите имя или email..."
                  className="pl-9 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Поиск..." : "Найти"}
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">Результаты поиска</h3>
                <div className="space-y-3">
                  {searchResults.map((result) => {
                    const isPending = isPendingRequest(result.id);
                    return (
                      <div key={result.id} className="flex items-center justify-between bg-secondary/20 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={result.avatar} />
                            <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-muted-foreground">{result.email}</div>
                          </div>
                        </div>
                        {isPending ? (
                          <Button 
                            size="sm"
                            variant="secondary"
                            disabled
                          >
                            Запрос отправлен
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleAddFriend(result)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Добавить
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs defaultValue="friends">
          <TabsList className="mb-6">
            <TabsTrigger value="friends">Друзья ({acceptedFriends.length})</TabsTrigger>
            <TabsTrigger value="requests">Заявки ({pendingFriends.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends">
            <div className="space-y-4">
              {acceptedFriends.length === 0 ? (
                <div className="text-center py-12 bg-secondary/20 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">У вас пока нет друзей</h3>
                  <p className="text-muted-foreground mb-4">
                    Найдите друзей с помощью поиска выше
                  </p>
                </div>
              ) : (
                acceptedFriends.map((friend) => {
                  // Determine friend ID based on who added whom
                  const friendId = friend.id === user?.id ? friend.toUserId! : friend.id;
                  
                  return (
                    <div key={friendId} className="flex items-center justify-between bg-secondary/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{friend.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {friend.email || `user${friend.id}@example.com`}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                        >
                          <a href={`/messages?id=${friendId}`}>Сообщение</a>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveFriend(friendId)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="requests">
            <div className="space-y-4">
              {pendingFriends.length === 0 ? (
                <div className="text-center py-12 bg-secondary/20 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Нет входящих заявок</h3>
                  <p className="text-muted-foreground">
                    У вас нет заявок в друзья на рассмотрении
                  </p>
                </div>
              ) : (
                pendingFriends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between bg-secondary/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{friend.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {friend.email || `user${friend.id}@example.com`}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleAcceptFriend(friend.id)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Принять
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRejectFriend(friend.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Отклонить
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Friends;
