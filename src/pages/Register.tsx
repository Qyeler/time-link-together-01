
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов"),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
  confirmPassword: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

const Register = () => {
  const { register, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);
      await register(values.name, values.email, values.password);
      // Нет редиректа здесь - он обрабатывается в PublicRoute компоненте
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
  
  const loading = isLoading || submitting;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Создать аккаунт</CardTitle>
          <CardDescription className="text-center">
            Введите ваши данные для регистрации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Иванов" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@mail.ru" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтвердите пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="black" className="w-full" disabled={loading}>
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col">
          <div className="text-center text-sm">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
