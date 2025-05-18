
import React, { useState } from 'react';
import { Bell, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthOverlay } from '../Auth/AuthOverlay';
import { useSchedule } from '../../context/ScheduleContext';
import { Badge } from '../ui/badge';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { notifications } = useSchedule();
  const [showAuthOverlay, setShowAuthOverlay] = React.useState(false);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <h1 className="text-2xl font-bold">Schedle</h1>
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
          
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
