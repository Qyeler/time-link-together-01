
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MessageCircle, UserPlus, Settings, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';

export const Sidebar: React.FC = () => {
  // Mock data for friends
  const friendsList = [
    { id: '1', name: 'Ник', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: '2', name: 'erzo333', avatar: 'https://via.placeholder.com/40', status: 'offline' },
    { id: '3', name: 'Nikitonskyyyy', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: '4', name: 'mknikk', avatar: 'https://via.placeholder.com/40', status: 'offline' },
    { id: '5', name: 'Тимур Байрамов', avatar: 'https://via.placeholder.com/40', status: 'offline' },
    { id: '6', name: 'mashnovv', avatar: 'https://via.placeholder.com/40', status: 'online' },
  ];

  const [activeTab, setActiveTab] = useState('friends');

  return (
    <aside className="w-64 bg-sidebar h-full flex flex-col border-r border-sidebar-border">
      <div className="flex p-2 space-x-1 border-b border-sidebar-border">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 p-2 rounded-md text-sm ${
            activeTab === 'friends'
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
          }`}
        >
          Друзья <Badge variant="secondary" className="ml-1">5</Badge>
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 p-2 rounded-md text-sm ${
            activeTab === 'events'
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
          }`}
        >
          Мероприятия <Badge variant="secondary" className="ml-1">1</Badge>
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 p-2 rounded-md text-sm ${
            activeTab === 'chats'
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
          }`}
        >
          Чаты <Badge variant="secondary" className="ml-1">2</Badge>
        </button>
      </div>

      {activeTab === 'friends' && (
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-2">
            <div className="relative">
              <input
                type="search"
                placeholder="Поиск в друзья"
                className="w-full rounded-md border border-sidebar-border bg-sidebar-accent/50 py-2 px-3 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/70 focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
              />
            </div>
          </div>
          
          <div className="flex space-x-2 mb-2">
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Создать группу
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Заявки в друзья
              <Badge variant="secondary" className="ml-1">3</Badge>
            </Button>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-1">
            {friendsList.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium text-sidebar-foreground">{friend.name}</div>
                </div>
                <button className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-sidebar-foreground/70 text-center py-4">Здесь будут отображаться ваши предстоящие мероприятия</p>
        </div>
      )}

      {activeTab === 'chats' && (
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-sidebar-foreground/70 text-center py-4">Здесь будут отображаться ваши чаты</p>
        </div>
      )}

      <div className="p-2 border-t border-sidebar-border">
        <div className="flex items-center justify-around">
          <Link to="/" className="sidebar-menu-item">
            <Calendar className="h-5 w-5" />
          </Link>
          <Link to="/friends" className="sidebar-menu-item">
            <Users className="h-5 w-5" />
          </Link>
          <Link to="/messages" className="sidebar-menu-item">
            <MessageCircle className="h-5 w-5" />
          </Link>
          <Link to="/settings" className="sidebar-menu-item">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
