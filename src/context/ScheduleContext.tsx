import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Group, Friend, CalendarViewMode, CalendarFilters, User, PrivacySettings, FriendRequest } from '../types';
import { addDays, subDays, differenceInDays, isSameDay, isWithinInterval } from 'date-fns';
import { useAuth } from './AuthContext';
import { toast } from '../hooks/use-toast';

// Моковые данные для тестирования
const mockUsers: User[] = [
  { id: '1', name: 'Александр Петров', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Мария Иванова', email: 'maria@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '3', name: 'Дмитрий Сидоров', email: 'dmitry@example.com', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '4', name: 'Елена Смирнова', email: 'elena@example.com', avatar: 'https://i.pravatar.cc/150?img=9' },
];

// Дополнительные пользователи
const additionalUsers: User[] = [
  { id: '5', name: 'Иван Иванов', email: 'ivan@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '6', name: 'Ольга Петрова', email: 'olga@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '7', name: 'Сергей Кузнецов', email: 'sergey@example.com', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '8', name: 'Анна Соколова', email: 'anna@example.com', avatar: 'https://i.pravatar.cc/150?img=7' },
];

const allUsers = [...mockUsers, ...additionalUsers];

const mockFriends: Friend[] = [
  { ...mockUsers[1], status: 'accepted' },
  { ...mockUsers[2], status: 'pending' },
  { ...additionalUsers[0], status: 'accepted' }, 
  { ...additionalUsers[1], status: 'accepted' },
  { ...additionalUsers[2], status: 'pending' },
];

const mockGroups: Group[] = [
  {
    id: 'g1',
    name: 'Проектная команда',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: 'g2',
    name: 'Спортивный клуб',
    members: [mockUsers[0], mockUsers[3]],
    avatar: 'https://i.pravatar.cc/150?img=23',
  },
];

// Создаем набор моковых событий на текущий месяц
const generateMockEvents = (baseDate: Date): Event[] => {
  const currentUser = mockUsers[0]; // Текущий пользователь
  const today = new Date(baseDate);
  today.setHours(0, 0, 0, 0);
  
  const result: Event[] = [
    {
      id: 'e1',
      title: 'Встреча с командой',
      description: 'Обсуждение квартального плана',
      start: addDays(today, 1),
      end: addDays(today, 1),
      location: 'Офис, переговорная №3',
      color: '#4f46e5',
      type: 'work',
      createdBy: currentUser.id,
      participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
      groupId: 'g1',
    },
    {
      id: 'e2',
      title: 'Тренировка',
      description: 'Еженедельная тренировка',
      start: addDays(today, 2),
      end: addDays(today, 2),
      location: 'Спортзал "Олимп"',
      color: '#10b981',
      type: 'personal',
      createdBy: currentUser.id,
      recurring: {
        frequency: 'weekly',
      },
    },
    {
      id: 'e3',
      title: 'Обед с Марией',
      description: 'Встреча в кафе',
      start: addDays(today, 3),
      end: addDays(today, 3),
      location: 'Кафе "Уют"',
      color: '#f59e0b',
      type: 'friend',
      createdBy: currentUser.id,
      participants: [mockUsers[0], mockUsers[1]],
    },
    {
      id: 'e4',
      title: 'Совещание по проекту',
      description: 'Статус и планирование',
      start: subDays(today, 2),
      end: subDays(today, 2),
      location: 'Онлайн, Zoom',
      color: '#ef4444',
      type: 'work',
      createdBy: currentUser.id,
      participants: [mockUsers[0], mockUsers[2]],
      groupId: 'g1',
    },
    {
      id: 'e5',
      title: 'День рождения Елены',
      description: 'Не забыть купить подарок!',
      start: addDays(today, 5),
      end: addDays(today, 5),
      location: 'Ресторан "Панорама"',
      color: '#8b5cf6',
      type: 'friend',
      createdBy: mockUsers[3].id,
      participants: [mockUsers[0], mockUsers[3]],
    },
    {
      id: 'e6',
      title: 'Поход в кино',
      description: 'Новый блокбастер',
      start: addDays(today, 7),
      end: addDays(today, 7),
      location: 'Кинотеатр "Космос"',
      color: '#ec4899',
      type: 'friend',
      createdBy: mockUsers[1].id,
      participants: [mockUsers[0], mockUsers[1], mockUsers[3]],
    },
    // Добавим многодневное событие
    {
      id: 'e7',
      title: 'Конференция',
      description: 'Ежегодная отраслевая конференция',
      start: new Date(today.getFullYear(), today.getMonth(), 16, 10, 0),
      end: new Date(today.getFullYear(), today.getMonth(), 20, 18, 0),
      isMultiDay: true,
      location: 'Конференц-центр "Горизонт"',
      color: '#0ea5e9',
      type: 'work',
      createdBy: currentUser.id,
      participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
    },
    // Многодневное событие с друзьями
    {
      id: 'e8',
      title: 'Поездка на озеро',
      description: 'Выходные на природе',
      start: new Date(today.getFullYear(), today.getMonth(), 22, 8, 0),
      end: new Date(today.getFullYear(), today.getMonth(), 24, 20, 0),
      isMultiDay: true,
      location: 'Озеро "Чистое"',
      color: '#10b981',
      type: 'friend',
      createdBy: currentUser.id,
      participants: [mockUsers[0], mockUsers[1], additionalUsers[0]],
    }
  ];
  
  return result;
};

const defaultPrivacySettings: PrivacySettings = {
  whoCanSeeSchedule: 'friends',
  whoCanInvite: 'friends',
  whoCanMessage: 'friends',
  whoCanSeeProfile: 'all',
};

interface ScheduleContextType {
  events: Event[];
  groups: Group[];
  friends: Friend[];
  allUsers: User[];
  currentUser: User | null;
  privacySettings: PrivacySettings;
  viewMode: CalendarViewMode;
  filters: CalendarFilters;
  selectedDate: Date;
  selectedEvent: Event | null;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setFilters: (filters: CalendarFilters) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedEvent: (event: Event | null) => void;
  setPrivacySettings: (settings: PrivacySettings) => void;
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (userId: string) => void;
  declineFriendRequest: (userId: string) => void;
  removeFriend: (userId: string) => void;
  updateUserProfile: (user: Partial<User>) => void;
  isAuthenticated: boolean;
  // Add aliases for functions used in Friends.tsx
  addFriend: (friend: Friend) => void;
  acceptFriend: (friendId: string) => void;
  rejectFriend: (friendId: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType>({
  events: [],
  groups: [],
  friends: [],
  allUsers: [],
  currentUser: null,
  privacySettings: defaultPrivacySettings,
  viewMode: 'month',
  filters: {
    showPersonalEvents: true,
    showFriendEvents: true,
    showWorkEvents: true,
  },
  selectedDate: new Date(),
  selectedEvent: null,
  addEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
  setViewMode: () => {},
  setFilters: () => {},
  setSelectedDate: () => {},
  setSelectedEvent: () => {},
  setPrivacySettings: () => {},
  sendFriendRequest: () => {},
  acceptFriendRequest: () => {},
  declineFriendRequest: () => {},
  removeFriend: () => {},
  updateUserProfile: () => {},
  isAuthenticated: false,
  // Add empty implementations for aliases
  addFriend: () => {},
  acceptFriend: () => {},
  rejectFriend: () => {},
});

export const useSchedule = () => useContext(ScheduleContext);

export const ScheduleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated, user: authUser, updateProfile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [filters, setFilters] = useState<CalendarFilters>({
    showPersonalEvents: true,
    showFriendEvents: true,
    showWorkEvents: true,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Синхронизация текущего пользователя с авторизацией
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
    }
  }, [authUser]);

  // Инициализация моковых событий при загрузке
  useEffect(() => {
    setEvents(generateMockEvents(selectedDate));
  }, []);

  // Обновление моковых событий при изменении месяца
  useEffect(() => {
    setEvents(generateMockEvents(selectedDate));
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);

  const addEvent = (event: Event) => {
    // Если это многодневное событие, помечаем его
    if (event.end.getTime() - event.start.getTime() > 24 * 60 * 60 * 1000) {
      event.isMultiDay = true;
    }
    setEvents([...events, event]);
    toast({
      title: "Событие создано",
      description: "Событие успешно добавлено в расписание",
    });
  };

  const updateEvent = (updatedEvent: Event) => {
    // Обновляем признак многодневного события
    if (updatedEvent.end.getTime() - updatedEvent.start.getTime() > 24 * 60 * 60 * 1000) {
      updatedEvent.isMultiDay = true;
    } else {
      updatedEvent.isMultiDay = false;
    }
    
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    toast({
      title: "Событие обновлено",
      description: "Изменения успешно сохранены",
    });
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast({
      title: "Событие удалено",
      description: "Событие успешно удалено из расписания",
    });
  };

  // Управление друзьями
  const sendFriendRequest = (userId: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return;
    
    // Проверяем, не отправлен ли уже запрос
    const existingRequest = friends.find(f => f.id === userId);
    if (existingRequest) {
      toast({
        title: "Запрос уже отправлен",
        description: `У вас уже есть ${existingRequest.status === 'accepted' ? 'дружба' : 'запрос'} с ${targetUser.name}`,
      });
      return;
    }
    
    // Добавляем пользователя в список друзей со статусом pending
    setFriends([...friends, { ...targetUser, status: 'pending' }]);
    toast({
      title: "Запрос отправлен",
      description: `Запрос на добавление в друзья отправлен ${targetUser.name}`,
    });
  };
  
  const acceptFriendRequest = (userId: string) => {
    setFriends(
      friends.map(friend => 
        friend.id === userId ? { ...friend, status: 'accepted' } : friend
      )
    );
    toast({
      title: "Запрос принят",
      description: "Пользователь добавлен в список друзей",
    });
  };
  
  const declineFriendRequest = (userId: string) => {
    setFriends(
      friends.map(friend => 
        friend.id === userId ? { ...friend, status: 'declined' } : friend
      )
    );
    toast({
      title: "Запрос отклонен",
      description: "Запрос на добавление в друзья отклонен",
    });
  };
  
  const removeFriend = (userId: string) => {
    setFriends(friends.filter(friend => friend.id !== userId));
    toast({
      title: "Друг удален",
      description: "Пользователь удален из списка друзей",
    });
  };
  
  // Обновление профиля
  const updateUserProfile = (userUpdate: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...userUpdate }));
    
    // Синхронизация с AuthContext если есть
    if (updateProfile) {
      updateProfile(userUpdate);
    }
    
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные профиля успешно обновлены",
    });
  };

  // Получение отфильтрованных событий на основе текущих фильтров
  const getFilteredEvents = () => {
    return events.filter(event => {
      if (event.type === 'personal' && !filters.showPersonalEvents) return false;
      if (event.type === 'friend' && !filters.showFriendEvents) return false;
      if (event.type === 'work' && !filters.showWorkEvents) return false;
      return true;
    });
  };

  return (
    <ScheduleContext.Provider
      value={{
        events: getFilteredEvents(),
        groups,
        friends,
        allUsers,
        currentUser,
        privacySettings,
        viewMode,
        filters,
        selectedDate,
        selectedEvent,
        addEvent,
        updateEvent,
        deleteEvent,
        setViewMode,
        setFilters,
        setSelectedDate,
        setSelectedEvent,
        setPrivacySettings,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        updateUserProfile,
        isAuthenticated,
        // Add aliases to match the functions used in Friends.tsx
        addFriend: (friend: Friend) => sendFriendRequest(friend.id),
        acceptFriend: acceptFriendRequest,
        rejectFriend: declineFriendRequest,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
