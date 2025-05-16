
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов"),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
  confirmPassword: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

const AuthPage = () => {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // If user is logged in, go to the main page
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      setSubmitting(true);
      await login(values.email, values.password);
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Ошибка входа",
        description: "Проверьте ваши учетные данные и попробуйте снова",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    try {
      setSubmitting(true);
      await register(values.name, values.email, values.password);
      navigate('/');
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Ошибка регистрации",
        description: "Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Schedle</CardTitle>
          <CardDescription className="text-center">
            Войдите или зарегистрируйтесь для доступа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Войти</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 pt-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@mail.ru" {...field} disabled={submitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} disabled={submitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && activeTab === "login" ? "Вход..." : "Войти"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4 pt-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input placeholder="Иван Иванов" {...field} disabled={submitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@mail.ru" {...field} disabled={submitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} disabled={submitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подтвердите пароль</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} disabled={submitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="black" className="w-full" disabled={submitting}>
                    {submitting && activeTab === "register" ? "Регистрация..." : "Зарегистрироваться"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Для быстрого тестирования:
            <div className="mt-1">user1@example.com / password123</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
