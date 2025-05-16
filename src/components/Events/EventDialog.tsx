
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '../../lib/utils';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Event } from '../../types';

const formSchema = z.object({
  title: z.string().min(1, 'Название события обязательно'),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().optional(),
  type: z.enum(['personal', 'friend', 'group', 'work']),
  color: z.string(),
  participants: z.array(z.string()).optional(),
});

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent?: Event | null;
}

export const EventDialog: React.FC<EventDialogProps> = ({ 
  open, 
  onOpenChange, 
  editingEvent = null
}) => {
  const { addEvent, updateEvent, selectedDate, friends } = useSchedule();
  
  const acceptedFriends = friends.filter(friend => friend.status === 'accepted');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: selectedDate,
      endDate: new Date(selectedDate.getTime() + 60 * 60 * 1000), // Add 1 hour
      location: '',
      type: 'personal',
      color: '#4f46e5',
      participants: [],
    },
  });

  // Заполнение формы данными редактируемого события
  useEffect(() => {
    if (editingEvent) {
      const participantIds = editingEvent.participants?.map(p => p.id) || [];
      
      form.reset({
        title: editingEvent.title,
        description: editingEvent.description || '',
        startDate: new Date(editingEvent.start),
        endDate: new Date(editingEvent.end),
        location: editingEvent.location || '',
        type: editingEvent.type,
        color: editingEvent.color,
        participants: participantIds,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        startDate: selectedDate,
        endDate: new Date(selectedDate.getTime() + 60 * 60 * 1000),
        location: '',
        type: 'personal',
        color: '#4f46e5',
        participants: [],
      });
    }
  }, [editingEvent, open, selectedDate]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Находим пользователей по ID для добавления в участники
    const selectedParticipants = acceptedFriends
      .filter(friend => data.participants?.includes(friend.id))
      .map(friend => ({
        id: friend.id,
        name: friend.name,
        email: friend.email,
        avatar: friend.avatar
      }));
    
    if (editingEvent) {
      // Обновление события
      updateEvent({
        ...editingEvent,
        title: data.title,
        description: data.description,
        start: data.startDate,
        end: data.endDate,
        location: data.location,
        type: data.type,
        color: data.color,
        participants: selectedParticipants.length > 0 ? selectedParticipants : undefined,
      });
    } else {
      // Создание нового события
      addEvent({
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        start: data.startDate,
        end: data.endDate,
        location: data.location,
        type: data.type,
        color: data.color,
        createdBy: '1', // Current user ID
        participants: selectedParticipants.length > 0 ? selectedParticipants : undefined,
      });
    }
    
    onOpenChange(false);
  };

  // Получение хранимых значений выбранных участников
  const selectedParticipantIds = form.watch('participants') || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Редактировать событие' : 'Создать событие'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название события" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Описание события (необязательно)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата начала</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ru })
                            ) : (
                              <span>Выберите дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата окончания</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ru })
                            ) : (
                              <span>Выберите дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Место</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Добавьте место (необязательно)" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип события</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип события" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal">Личное</SelectItem>
                      <SelectItem value="friend">С друзьями</SelectItem>
                      <SelectItem value="group">Групповое</SelectItem>
                      <SelectItem value="work">Рабочее/Учебное</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="participants"
              render={() => (
                <FormItem>
                  <FormLabel>Участники</FormLabel>
                  <div className="border rounded-md p-4">
                    <div className="space-y-2">
                      {acceptedFriends.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          У вас пока нет друзей. Добавьте их на странице "Друзья".
                        </div>
                      ) : (
                        acceptedFriends.map(friend => (
                          <div key={friend.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`friend-${friend.id}`}
                              checked={selectedParticipantIds.includes(friend.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  form.setValue('participants', [
                                    ...selectedParticipantIds,
                                    friend.id
                                  ]);
                                } else {
                                  form.setValue('participants', 
                                    selectedParticipantIds.filter(id => id !== friend.id)
                                  );
                                }
                              }}
                            />
                            <label htmlFor={`friend-${friend.id}`} className="flex items-center cursor-pointer">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={friend.avatar} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{friend.name}</span>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цвет</FormLabel>
                  <div className="flex space-x-2">
                    {['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => (
                      <div 
                        key={color}
                        className={cn(
                          "h-8 w-8 rounded-full cursor-pointer border-2",
                          field.value === color ? "border-primary ring-2 ring-primary/30" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => form.setValue('color', color)}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {editingEvent ? 'Отмена' : 'Отмена'}
              </Button>
              <Button type="submit">
                {editingEvent ? 'Сохранить' : 'Создать'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
