
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, MessageCircle, UserPlus, Settings, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { useSchedule } from '../../context/ScheduleContext';
import { useAuth } from '../../context/AuthContext';
import { Event, Friend } from '../../types';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { friends, events } = useSchedule();
  const { user, switchUser } = useAuth();
  
  // Filter accepted friends
  const acceptedFriends = friends.filter((friend) => friend.status === 'accepted');
  
  // Filter pending friend requests
  const pendingRequests = friends.filter((friend) => friend.status === 'pending');
  
  // Filter group/event type events
  const groupEvents = events.filter((event) => event.type === 'group');
  
  const [activeTab, setActiveTab] = useState('friends');
  
  const handleSwitchUser = () => {
    // Toggle between user1 and user2 for demo purposes
    if (user?.id === 'user1') {
      switchUser('user2');
    } else {
      switchUser('user1');
    }
  };

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
          Друзья <Badge variant="secondary" className="ml-1">{acceptedFriends.length}</Badge>
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 p-2 rounded-md text-sm ${
            activeTab === 'events'
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
          }`}
        >
          Мероприятия <Badge variant="secondary" className="ml-1">{groupEvents.length}</Badge>
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 p-2 rounded-md text-sm ${
            activeTab === 'chats'
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
          }`}
        >
          Чаты <Badge variant="secondary" className="ml-1">{acceptedFriends.length}</Badge>
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
            <Link to="/friends">
              <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Заявки
                {pendingRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{pendingRequests.length}</Badge>
                )}
              </Button>
            </Link>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-1">
            {acceptedFriends.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                У вас пока нет друзей.
                <div>
                  <Link to="/friends" className="text-primary hover:underline">
                    Добавить друзей
                  </Link>
                </div>
              </div>
            ) : (
              acceptedFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-sidebar-foreground">{friend.name}</div>
                  </div>
                  <Link 
                    to={`/messages?id=${friend.id}`} 
                    className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="flex-1 overflow-y-auto p-2">
          {groupEvents.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              У вас пока нет мероприятий
            </div>
          ) : (
            <div className="space-y-2">
              {groupEvents.map((event: Event) => (
                <div key={event.id} className="p-3 rounded-md bg-sidebar-accent/30 hover:bg-sidebar-accent">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(event.start).toLocaleDateString()}
                  </div>
                  {event.location && (
                    <div className="text-xs text-muted-foreground mt-1">{event.location}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'chats' && (
        <div className="flex-1 overflow-y-auto p-2">
          {acceptedFriends.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              У вас пока нет активных чатов
            </div>
          ) : (
            <div className="space-y-2">
              {acceptedFriends.map((friend) => (
                <Link to={`/messages?id=${friend.id}`} key={friend.id}>
                  <div className="flex items-center p-2 rounded-md hover:bg-sidebar-accent">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium text-sidebar-foreground">{friend.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-2 border-t border-sidebar-border">
        <div className="flex items-center justify-around">
          <Link to="/" className={`sidebar-menu-item ${location.pathname === '/' ? 'text-primary' : ''}`}>
            <Calendar className="h-5 w-5" />
          </Link>
          <Link to="/friends" className={`sidebar-menu-item ${location.pathname === '/friends' ? 'text-primary' : ''}`}>
            <Users className="h-5 w-5" />
          </Link>
          <Link to="/messages" className={`sidebar-menu-item ${location.pathname === '/messages' ? 'text-primary' : ''}`}>
            <MessageCircle className="h-5 w-5" />
          </Link>
          <Link to="/settings" className={`sidebar-menu-item ${location.pathname === '/settings' ? 'text-primary' : ''}`}>
            <Settings className="h-5 w-5" />
          </Link>
        </div>
        
        {/* For demo: Button to switch between user1 and user2 */}
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={handleSwitchUser}
          >
            Переключиться на {user?.id === 'user1' ? 'User2' : 'User1'}
          </Button>
        </div>
      </div>
    </aside>
  );
};
