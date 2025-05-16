
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ScheduleProvider } from "./context/ScheduleContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Friends from "./pages/Friends";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simplified ProtectedRoute component - will still show loading state but won't redirect
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();
  
  // Показываем загрузку, пока проверяем статус аутентификации
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }
  
  // Всегда отображаем содержимое маршрута
  return <>{children}</>;
};

// Упрощенный PublicRoute component - просто отображает содержимое без проверок
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();
  
  // Показываем загрузку, пока проверяем статус аутентификации
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }
  
  // Всегда отображаем содержимое маршрута
  return <>{children}</>;
};

// AppRoutes component для использования контекста аутентификации
const AppRoutes = () => {
  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route 
        path="/login" 
        element={<Navigate to="/" replace />} 
      />
      <Route 
        path="/register" 
        element={<Navigate to="/" replace />} 
      />
      
      {/* Основные маршруты */}
      <Route 
        path="/" 
        element={<Index />} 
      />
      <Route 
        path="/settings" 
        element={<Settings />} 
      />
      <Route 
        path="/friends" 
        element={<Friends />} 
      />
      
      {/* Маршрут для обработки несуществующих путей */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ScheduleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ScheduleProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
