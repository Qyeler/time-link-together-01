
import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

export const Navbar: React.FC = () => {
  const { isLoading, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

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
          {isLoading ? (
            // Показываем скелетон загрузки
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse"></div>
            </div>
          ) : isAuthenticated ? (
            // Пользователь авторизован
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 flex h-2 w-2 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-0" size="icon">
                    <Avatar>
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'У'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name || 'User1'}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">{user?.email || 'user1@example.com'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/settings">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Профиль</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Пользователь не авторизован
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Войти
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
