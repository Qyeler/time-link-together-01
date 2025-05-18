
import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { useSchedule } from '../context/ScheduleContext';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Send } from 'lucide-react';
import { Friend, Message } from '../types';
import { useLocation } from 'react-router-dom';

const Messages = () => {
  const { friends } = useSchedule();
  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialChatId = queryParams.get('id');
  
  const [activeChat, setActiveChat] = useState<string | null>(initialChatId);
  const [message, setMessage] = useState('');
  
  // Only show accepted friends of current user
  const acceptedFriends = friends.filter(friend => 
    friend.status === 'accepted' && 
    (friend.addedBy === user?.id || friend.toUserId === user?.id)
  );
  
  // Messages are stored per user
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    if (!user) return {};
    
    // Try to get messages from localStorage
    const savedMessages = localStorage.getItem(`chatMessages_${user.id}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        
        // Convert string dates to Date objects
        const processedMessages: Record<string, Message[]> = {};
        Object.entries(parsedMessages).forEach(([chatKey, chatMessages]) => {
          processedMessages[chatKey] = (chatMessages as any[]).map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
        
        return processedMessages;
      } catch (error) {
        console.error('Error parsing chat messages:', error);
        return {};
      }
    }
    
    return {};
  });

  // Save messages to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`chatMessages_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);
  
  // Set initial active chat
  useEffect(() => {
    if (initialChatId) {
      setActiveChat(initialChatId);
    } else if (acceptedFriends.length > 0 && !activeChat) {
      setActiveChat(acceptedFriends[0].id);
    }
  }, [initialChatId, acceptedFriends, activeChat]);
  
  const handleSendMessage = () => {
    if (!message.trim() || !activeChat || !user) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: activeChat,
      content: message,
      timestamp: new Date(),
    };
    
    // Create chat key for the conversation
    const chatKey = activeChat;
    
    setMessages(prev => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), newMessage],
    }));
    
    setMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Get messages for a specific conversation
  const getUserMessages = (friendId: string) => {
    if (!user) return [];
    
    // Create chat key for the conversation
    const chatKey = friendId;
    
    // Return messages for this chat or empty array
    return messages[chatKey] || [];
  };
  
  const renderChatList = () => {
    if (acceptedFriends.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p>У вас пока нет друзей</p>
          <Button variant="link" asChild>
            <a href="/friends">Добавить друзей</a>
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {acceptedFriends.map((friend) => {
          // Get messages for this chat
          const chatMessages = getUserMessages(friend.id);
          
          // Get last message in chat
          const lastMessage = chatMessages.length 
            ? chatMessages[chatMessages.length - 1]
            : null;
            
          return (
            <div
              key={friend.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                activeChat === friend.id ? 'bg-secondary' : 'hover:bg-secondary/50'
              }`}
              onClick={() => setActiveChat(friend.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{friend.name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {lastMessage ? lastMessage.content : 'Нет сообщений'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderChatMessages = () => {
    if (!activeChat || !user) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Выберите чат, чтобы начать общение
        </div>
      );
    }
    
    // Get messages for active chat
    const chatMessages = getUserMessages(activeChat);
    const activeFriend = acceptedFriends.find(f => f.id === activeChat);
    
    if (!activeFriend) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Выберите чат, чтобы начать общение
        </div>
      );
    }
    
    return (
      <div className="flex flex-col h-full">
        <div className="border-b p-4 flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={activeFriend.avatar} />
            <AvatarFallback>{activeFriend.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{activeFriend.name}</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              У вас пока нет сообщений с этим пользователем
            </div>
          ) : (
            chatMessages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.senderId === user.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary'
                  }`}
                >
                  <div>{msg.content}</div>
                  <div className={`text-xs ${
                    msg.senderId === user.id 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Invalid time'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="border-t p-4">
          <div className="flex">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите сообщение..."
              className="mr-2"
            />
            <Button onClick={handleSendMessage} type="button">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container py-6 flex h-[calc(100vh-80px)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full w-full">
          <div className="col-span-1 border rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Чаты</h2>
            </div>
            <div className="p-2 overflow-y-auto h-[calc(100%-60px)]">
              {renderChatList()}
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-3 border rounded-lg overflow-hidden">
            {renderChatMessages()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
