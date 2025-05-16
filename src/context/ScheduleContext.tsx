
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Group, Friend, CalendarViewMode, CalendarFilters, User, PrivacySettings } from '../types';
import { addDays, subDays } from 'date-fns';

// Моковые данные для тестирования
const mockUsers: User[] = [
  { id: '1', name: 'Александр Петров', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Мария Иванова', email: 'maria@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '3', name: 'Дмитрий Сидоров', email: 'dmitry@example.com', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '4', name: 'Елена Смирнова', email: 'elena@example.com', avatar: 'https://i.pravatar.cc/150?img=9' },
];

const mockFriends: Friend[] = [
  { ...mockUsers[1], status: 'accepted' },
  { ...mockUsers[2], status: 'pending' },
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
  
  return [
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
  ];
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
  currentUser: User;
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
}

const ScheduleContext = createContext<ScheduleContextType>({
  events: [],
  groups: [],
  friends: [],
  currentUser: mockUsers[0],
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
});

export const useSchedule = () => useContext(ScheduleContext);

export const ScheduleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [currentUser] = useState<User>(mockUsers[0]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [filters, setFilters] = useState<CalendarFilters>({
    showPersonalEvents: true,
    showFriendEvents: true,
    showWorkEvents: true,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Инициализация моковых событий при загрузке
  useEffect(() => {
    setEvents(generateMockEvents(selectedDate));
  }, []);

  // Обновление моковых событий при изменении месяца
  useEffect(() => {
    // Здесь мы "модифицируем" события для нового месяца
    // В реальном приложении здесь был бы API запрос
    setEvents(generateMockEvents(selectedDate));
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
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
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
