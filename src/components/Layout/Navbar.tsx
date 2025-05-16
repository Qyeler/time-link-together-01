
import React, { useState } from 'react';
import { Bell, Search, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthOverlay } from '../Auth/AuthOverlay';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [showAuthOverlay, setShowAuthOverlay] = React.useState(false);
  
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <h1 className="text-2xl font-bold">Schedle</h1>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
            <input
              type="search"
              placeholder="Поиск"
              className="w-full rounded-full border border-white/20 bg-white/10 py-2 pl-8 pr-4 text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>

        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 flex h-2 w-2 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs" />
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
