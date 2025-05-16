
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

// Protected Route component с улучшенной логикой
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Показываем загрузку, пока проверяем статус аутентификации
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }
  
  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Если пользователь аутентифицирован, показываем защищенный контент
  return <>{children}</>;
};

// Public Route component для страниц, которые должны быть доступны только неаутентифицированным пользователям
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Показываем загрузку, пока проверяем статус аутентификации
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }
  
  // Если пользователь уже аутентифицирован, перенаправляем на главную страницу
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Если пользователь не аутентифицирован, показываем публичный контент
  return <>{children}</>;
};

// AppRoutes component для использования контекста аутентификации
const AppRoutes = () => {
  return (
    <Routes>
      {/* Публичные маршруты (доступны только неаутентифицированным пользователям) */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Защищенные маршруты (доступны только аутентифицированным пользователям) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/friends" 
        element={
          <ProtectedRoute>
            <Friends />
          </ProtectedRoute>
        } 
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
