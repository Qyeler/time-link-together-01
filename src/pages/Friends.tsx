import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSchedule } from '../context/ScheduleContext';
import { Friend, User } from '../types';
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from '../hooks/use-mobile';
import { FriendItem } from '../components/Friends/FriendItem';
import { runFriendTests } from '../utils/friendTests';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';

const Friends = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    friends, 
    allUsers, 
    addFriend, 
    acceptFriend, 
    rejectFriend, 
    removeFriend
  } = useSchedule();
  
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Get accepted friends for current user
  const acceptedFriends = friends.filter((friend) => 
    friend.status === 'accepted' && 
    (friend.addedBy === user?.id || friend.toUserId === user?.id)
  );
  
  // Get pending friends requests sent TO current user (not FROM them)
  const pendingFriends = friends.filter((friend) => 
    friend.status === 'pending' && 
    friend.toUserId === user?.id && 
    friend.addedBy !== user?.id
  );
  
  useEffect(() => {
    console.log("Current user:", user);
    console.log("All friends:", friends);
    console.log("Accepted friends:", acceptedFriends);
    console.log("Pending friends:", pendingFriends);
  }, [user, friends, acceptedFriends, pendingFriends]);
  
  // Handle search
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
    
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };
  
  // Search results - exclude current user and existing friends
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || !user) return [];
    
    // Filter by search query
    const results = allUsers.filter(searchUser => 
      searchUser.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (searchUser.email && searchUser.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Exclude current user and existing friends/requests
    return results.filter(result => {
      if (result.id === user.id) return false;
      
      // Check if already a friend or has pending request
      return !friends.some(friend => 
        (friend.addedBy === user.id && friend.toUserId === result.id) ||
        (friend.addedBy === result.id && friend.toUserId === user.id)
      );
    });
  }, [searchQuery, friends, user, allUsers]);
  
  // Check if a pending request exists for a user
  const isPendingRequest = (userId: string) => {
    return friends.some(friend => 
      friend.addedBy === user?.id && 
      friend.toUserId === userId && 
      friend.status === 'pending'
    );
  };
  
  // Add friend handler
  const handleAddFriend = (friendToAdd: User) => {
    if (user) {
      addFriend(friendToAdd.id);
      
      // Run tests after adding
      setTimeout(() => {
        runFriendTests(friends, user, friendToAdd);
      }, 500);
      
      toast({
        title: "Запрос отправлен",
        description: `Запрос на добавление в друзья отправлен ${friendToAdd.name}`
      });
    }
  };
  
  // Accept friend request
  const handleAcceptFriend = (friendId: string) => {
    acceptFriend(friendId);
    toast({
      title: "Запрос принят",
      description: "Пользователь добавлен в список друзей"
    });
  };
  
  // Reject friend request
  const handleRejectFriend = (friendId: string) => {
    rejectFriend(friendId);
    toast({
      title: "Запрос отклонен",
      description: "Запрос на добавление в друзья отклонен"
    });
  };
  
  // Remove friend
  const handleRemoveFriend = (friendId: string) => {
    removeFriend(friendId);
    toast({
      title: "Друг удален",
      description: "Пользователь удален из списка друзей"
    });
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
            <div className="flex flex-col sm:flex-row gap-4">
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
              <Button onClick={handleSearch} disabled={isSearching} className={isMobile ? "w-full" : ""}>
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
        
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="friends" className="flex-1">Друзья ({acceptedFriends.length})</TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">Заявки ({pendingFriends.length})</TabsTrigger>
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
                  // Determine friend data
                  const friendId = friend.addedBy === user?.id ? friend.toUserId : friend.addedBy;
                  const friendData = allUsers.find(u => u.id === friendId) || friend;
                  
                  return (
                    <FriendItem 
                      key={friendId}
                      friend={{
                        ...friend,
                        id: friendId,
                        name: friendData.name,
                        email: friendData.email,
                        avatar: friendData.avatar
                      }}
                      onRemove={handleRemoveFriend}
                    />
                  );
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
                pendingFriends.map((friend) => {
                  // Get sender data
                  const senderData = allUsers.find(u => u.id === friend.addedBy) || friend;
                  
                  return (
                    <FriendItem
                      key={friend.id}
                      friend={{
                        ...friend,
                        name: senderData.name,
                        email: senderData.email,
                        avatar: senderData.avatar
                      }}
                      isPending={true}
                      onAccept={handleAcceptFriend}
                      onReject={handleRejectFriend}
                    />
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Friends;
