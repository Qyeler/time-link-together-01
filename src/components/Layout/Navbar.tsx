
import React from 'react';
import { Bell, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthOverlay } from '../Auth/AuthOverlay';
import { useSchedule } from '../../context/ScheduleContext';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { notifications, markNotificationAsRead, clearNotifications } = useSchedule();
  const [showAuthOverlay, setShowAuthOverlay] = React.useState(false);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Handle reading notifications
  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };
  
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <h1 className="text-2xl font-bold">Schedle</h1>
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Уведомления</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="py-2 px-4 text-center text-muted-foreground">
                    У вас нет новых уведомлений
                  </div>
                ) : (
                  <>
                    {notifications.slice(0, 10).map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className={`p-3 cursor-pointer ${notification.isRead ? 'opacity-70' : ''}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex items-start gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={undefined} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {notification.type === 'friend_request' ? 'FR' : 
                               notification.type === 'event_invite' ? 'EI' : 
                               notification.type === 'event_update' ? 'EU' : 'N'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-muted-foreground">{notification.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(new Date(notification.createdAt), 'dd.MM.yyyy HH:mm')}
                            </div>
                          </div>
                          {!notification.isRead && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex justify-center" onClick={() => clearNotifications()}>
                      Очистить все уведомления
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {isAuthenticated ? (
            <Link to="/settings">
              <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20">
                Профиль
              </Button>
            </Link>
          ) : (
            <Button 
              variant="ghost" 
              className="bg-white/10 text-white hover:bg-white/20"
              onClick={() => setShowAuthOverlay(true)}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Войти
            </Button>
          )}
        </nav>
      </div>
      
      {showAuthOverlay && (
        <AuthOverlay onClose={() => setShowAuthOverlay(false)} />
      )}
    </header>
  );
};
