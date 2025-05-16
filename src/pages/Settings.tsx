
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { MainLayout } from "../components/Layout/MainLayout";
import { toast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов",
  }),
  email: z
    .string()
    .min(1, { message: "Email обязателен" })
    .email("Неверный формат email"),
});

const privacyFormSchema = z.object({
  whoCanSeeSchedule: z.enum(["all", "friends", "none"]),
  whoCanInvite: z.enum(["all", "friends", "none"]),
  whoCanMessage: z.enum(["all", "friends", "none"]),
  whoCanSeeProfile: z.enum(["all", "friends", "none"]),
});

const Settings = () => {
  const { user } = useAuth();
  
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });
  
  const privacyForm = useForm<z.infer<typeof privacyFormSchema>>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      whoCanSeeSchedule: "friends",
      whoCanInvite: "friends",
      whoCanMessage: "all",
      whoCanSeeProfile: "all",
    },
  });
  
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные профиля были успешно обновлены.",
    });
  };
  
  const onPrivacySubmit = (data: z.infer<typeof privacyFormSchema>) => {
    toast({
      title: "Настройки приватности обновлены",
      description: "Ваши настройки приватности были успешно обновлены.",
    });
  };
  
  return (
    <MainLayout>
      <div className="container py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Настройки</h1>
            <p className="text-muted-foreground">
              Управляйте настройками своего аккаунта и приватности.
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="privacy">Приватность</TabsTrigger>
              <TabsTrigger value="notifications">Уведомления</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Изменить фото
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя</FormLabel>
                              <FormControl>
                                <Input placeholder="Иван Иванов" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="example@mail.ru" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Сохранить</Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Аккаунт</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Сменить пароль</h3>
                    <p className="text-muted-foreground text-sm">Обновите свой пароль.</p>
                    <Button variant="outline" className="mt-2">
                      Сменить пароль
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-destructive">Удалить аккаунт</h3>
                    <p className="text-muted-foreground text-sm">
                      Удаление аккаунта приведет к безвозвратной потере всех ваших данных.
                    </p>
                    <Button variant="destructive" className="mt-2">
                      Удалить аккаунт
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Настройки приватности</h2>
                <Form {...privacyForm}>
                  <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-4">
                    <FormField
                      control={privacyForm.control}
                      name="whoCanSeeSchedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Кто может видеть мое расписание</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">Все</SelectItem>
                              <SelectItem value="friends">Только друзья</SelectItem>
                              <SelectItem value="none">Никто</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Определяет, кто может видеть ваше расписание.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={privacyForm.control}
                      name="whoCanInvite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Кто может приглашать меня на мероприятия</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">Все</SelectItem>
                              <SelectItem value="friends">Только друзья</SelectItem>
                              <SelectItem value="none">Никто</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Определяет, кто может приглашать вас на мероприятия.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={privacyForm.control}
                      name="whoCanMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Кто может отправлять мне сообщения</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">Все</SelectItem>
                              <SelectItem value="friends">Только друзья</SelectItem>
                              <SelectItem value="none">Никто</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Определяет, кто может отправлять вам сообщения.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={privacyForm.control}
                      name="whoCanSeeProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Кто может видеть мой профиль</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">Все</SelectItem>
                              <SelectItem value="friends">Только друзья</SelectItem>
                              <SelectItem value="none">Никто</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Определяет, кто может видеть ваш профиль и фото.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Сохранить</Button>
                  </form>
                </Form>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Настройки уведомлений</h2>
                <p>В разработке...</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
