import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Group, Friend, CalendarViewMode, CalendarFilters, User, PrivacySettings, FriendRequest, Notification } from '../types';
import { addDays, subDays, differenceInDays, isSameDay, isWithinInterval } from 'date-fns';
import { useAuth } from './AuthContext';
import { toast } from '../hooks/use-toast';

interface ScheduleContextType {
  events: Event[];
  groups: Group[];
  friends: Friend[];
  allUsers: User[];
  currentUser: User | null;
  notifications: Notification[];
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
  // Friend request functions with new implementations
  addFriend: (userId: string) => void;
  acceptFriend: (friendId: string) => void;
  rejectFriend: (friendId: string) => void;
  // Friend request related functions
  getFriendRequests: (userId: string) => Friend[];
  hasFriendRequest: (fromUserId: string, toUserId: string) => boolean;
  // Notification functions
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

const defaultPrivacySettings: PrivacySettings = {
  whoCanSeeSchedule: 'friends',
  whoCanInvite: 'friends',
  whoCanMessage: 'friends',
  whoCanSeeProfile: 'all',
};

const ScheduleContext = createContext<ScheduleContextType>({
  events: [],
  groups: [],
  friends: [],
  allUsers: [],
  currentUser: null,
  notifications: [],
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
  // Change the type definition to match the implementation
  addFriend: () => {},
  acceptFriend: () => {},
  rejectFriend: () => {},
  // Friend request related functions
  getFriendRequests: () => [],
  hasFriendRequest: () => false,
  // Notification functions
  markNotificationAsRead: () => {},
  clearNotifications: () => {},
});

export const useSchedule = () => useContext(ScheduleContext);

// Helper to generate sample users based on a pattern
const generateUserList = (): User[] => {
  const userList: User[] = [];
  
  // Add user1 through user10
  for (let i = 1; i <= 10; i++) {
    userList.push({
      id: `user${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      avatar: `https://i.pravatar.cc/150?img=${i + 10}`
    });
  }
  
  return userList;
};

// Helper to generate mock events for a user
const generateUserEvents = (baseDate: Date, userId: string): Event[] => {
  const today = new Date(baseDate);
  today.setHours(0, 0, 0, 0);
  
  const events: Event[] = [
    {
      id: `e1-${userId}`,
      title: 'Встреча с командой',
      description: 'Обсуждение квартального плана',
      start: addDays(today, 1),
      end: addDays(today, 1),
      location: 'Офис, переговорная №3',
      color: '#4f46e5',
      type: 'work',
      createdBy: userId,
      participants: [],
    },
    {
      id: `e2-${userId}`,
      title: 'Тренировка',
      description: 'Еженедельная тренировка',
      start: addDays(today, 2),
      end: addDays(today, 2),
      location: 'Спортзал "Олимп"',
      color: '#10b981',
      type: 'personal',
      createdBy: userId,
      recurring: {
        frequency: 'weekly',
      },
    },
    {
      id: `e7-${userId}`,
      title: 'Конференция',
      description: 'Ежегодная отраслевая конференция',
      start: new Date(today.getFullYear(), today.getMonth(), 16, 10, 0),
      end: new Date(today.getFullYear(), today.getMonth(), 20, 18, 0),
      isMultiDay: true,
      location: 'Конференц-центр "Горизонт"',
      color: '#0ea5e9',
      type: 'work',
      createdBy: userId,
    }
  ];
  
  return events;
};

export const ScheduleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated, user: authUser, updateProfile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  // Initialize all users
  useEffect(() => {
    setAllUsers(generateUserList());
  }, []);

  // Sync current user with authentication
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
      
      // Load user-specific data from localStorage or initialize
      loadUserData(authUser.id);
    } else {
      setCurrentUser(null);
      setFriends([]);
      setEvents([]);
      setGroups([]);
      setNotifications([]);
    }
  }, [authUser]);

  // Save user data whenever it changes
  useEffect(() => {
    if (currentUser) {
      saveUserData(currentUser.id);
    }
  }, [friends, events, notifications, currentUser]);

  // Load user-specific data from localStorage
  const loadUserData = (userId: string) => {
    try {
      // Load friends
      const savedFriends = localStorage.getItem(`friends_${userId}`);
      if (savedFriends) {
        setFriends(JSON.parse(savedFriends));
      } else {
        setFriends([]);
      }
      
      // Load events
      const savedEvents = localStorage.getItem(`events_${userId}`);
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert string dates back to Date objects
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          recurring: event.recurring 
            ? { 
                ...event.recurring, 
                until: event.recurring.until ? new Date(event.recurring.until) : undefined 
              } 
            : undefined
        }));
        setEvents(eventsWithDates);
      } else {
        // Initialize with default events
        setEvents(generateUserEvents(selectedDate, userId));
      }
      
      // Load groups
      const savedGroups = localStorage.getItem(`groups_${userId}`);
      if (savedGroups) {
        setGroups(JSON.parse(savedGroups));
      } else {
        setGroups([]);
      }
      
      // Load notifications
      const savedNotifications = localStorage.getItem(`notifications_${userId}`);
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        const notificationsWithDates = parsedNotifications.map((notification: any) => ({
          ...notification,
          createdAt: new Date(notification.createdAt)
        }));
        setNotifications(notificationsWithDates);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Save user data to localStorage
  const saveUserData = (userId: string) => {
    try {
      localStorage.setItem(`friends_${userId}`, JSON.stringify(friends));
      localStorage.setItem(`events_${userId}`, JSON.stringify(events));
      localStorage.setItem(`groups_${userId}`, JSON.stringify(groups));
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Function to create a notification
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification.id;
  };

  // Function to mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  // Function to clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // COMPLETELY REWRITTEN FRIEND REQUEST SYSTEM
  
  // Function to get friend requests for a specific user
  const getFriendRequests = (userId: string): Friend[] => {
    return friends.filter(friend => 
      friend.status === 'pending' && 
      friend.toUserId === userId
    );
  };

  // Function to check if a friend request exists between two users
  const hasFriendRequest = (fromUserId: string, toUserId: string): boolean => {
    return friends.some(friend => 
      ((friend.addedBy === fromUserId && friend.toUserId === toUserId) || 
       (friend.addedBy === toUserId && friend.toUserId === fromUserId))
    );
  };

  // New implementation of add friend
  const addFriend = (targetUserId: string) => {
    // Validate input
    if (!currentUser || !targetUserId) {
      console.error("Cannot add friend: missing user information");
      return;
    }

    // Check if users are not the same
    if (currentUser.id === targetUserId) {
      console.error("Cannot add yourself as a friend");
      toast({
        title: "Ошибка",
        description: "Невозможно добавить себя в друзья",
        variant: "destructive"
      });
      return;
    }
    
    // Find target user info
    const targetUser = allUsers.find(u => u.id === targetUserId);
    if (!targetUser) {
      console.error(`Target user with ID ${targetUserId} not found`);
      toast({
        title: "Пользователь не найден",
        description: "Не удалось найти пользователя",
        variant: "destructive"
      });
      return;
    }
    
    // Check if request already exists
    const existingRequest = friends.find(f => 
      (f.addedBy === currentUser.id && f.toUserId === targetUserId) || 
      (f.addedBy === targetUserId && f.toUserId === currentUser.id)
    );
    
    if (existingRequest) {
      const status = existingRequest.status === 'accepted' ? 'уже друзья' : 'запрос уже отправлен';
      toast({
        title: "Запрос уже существует",
        description: `Вы и ${targetUser.name} ${status}`,
      });
      return;
    }

    // Generate a unique ID for the friend request
    const requestId = `friend-req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create new friend request with the right directionality
    const friendRequest: Friend = {
      id: requestId,
      name: targetUser.name,
      email: targetUser.email,
      avatar: targetUser.avatar,
      status: 'pending',
      addedBy: currentUser.id,  // Current user is sending the request
      toUserId: targetUserId    // Target user is receiving the request
    };
    
    console.log(`Creating friend request from ${currentUser.id} to ${targetUserId}`, friendRequest);
    
    // Add the request to state
    setFriends(prev => [...prev, friendRequest]);
    
    // Create notification for the target user
    addNotification({
      userId: targetUserId,
      title: 'Новый запрос в друзья',
      message: `${currentUser.name} хочет добавить вас в друзья`,
      type: 'friend_request',
      isRead: false,
      relatedId: currentUser.id
    });
    
    toast({
      title: "Запрос отправлен",
      description: `Запрос на добавление в друзья отправлен ${targetUser.name}`,
    });
  };

  // New implementation of accept friend
  const acceptFriend = (requestId: string) => {
    // Find the friend request by its ID
    const friendRequest = friends.find(friend => friend.id === requestId && friend.status === 'pending');
    
    if (!friendRequest) {
      toast({
        title: "Ошибка",
        description: "Запрос на добавление в друзья не найден",
        variant: "destructive"
      });
      return;
    }
    
    // Update the request status to accepted
    setFriends(prev => 
      prev.map(friend => 
        friend.id === requestId ? { ...friend, status: 'accepted' } : friend
      )
    );
    
    // Find the user who sent the request
    const requesterUser = allUsers.find(u => u.id === friendRequest.addedBy);
    
    if (requesterUser && currentUser) {
      // Add notification for the requester
      addNotification({
        userId: friendRequest.addedBy,
        title: 'Запрос в друзья принят',
        message: `${currentUser.name} принял(а) ваш запрос в друзья`,
        type: 'friend_accepted',
        isRead: false,
        relatedId: currentUser.id
      });
    }
    
    toast({
      title: "Запрос принят",
      description: "Пользователь добавлен в список друзей",
    });
  };

  // New implementation of reject friend
  const rejectFriend = (requestId: string) => {
    // Find the friend request by ID
    const friendRequest = friends.find(friend => friend.id === requestId && friend.status === 'pending');
    
    if (!friendRequest) {
      toast({
        title: "Ошибка",
        description: "Запрос на добавление в друзья не найден",
        variant: "destructive"
      });
      return;
    }
    
    // Remove the request from the state
    setFriends(prev => prev.filter(friend => friend.id !== requestId));
    
    toast({
      title: "Запрос отклонен",
      description: "Запрос на добавление в друзья отклонен",
    });
  };

  // New implementation of remove friend
  const removeFriend = (friendUserId: string) => {
    if (!currentUser) return;
    
    // Find and remove all friendship connections with this user
    setFriends(prev => prev.filter(friend => 
      !((friend.addedBy === currentUser.id && friend.toUserId === friendUserId) || 
        (friend.addedBy === friendUserId && friend.toUserId === currentUser.id))
    ));
    
    toast({
      title: "Друг удален",
      description: "Пользователь удален из списка друзей",
    });
  };

  const addEvent = (event: Event) => {
    // If this is a multi-day event, mark it
    if (event.end.getTime() - event.start.getTime() > 24 * 60 * 60 * 1000) {
      event.isMultiDay = true;
    }
    
    setEvents(prev => [...prev, event]);
    
    // Notify participants
    if (event.participants && event.participants.length > 0) {
      event.participants.forEach(participant => {
        if (participant.id !== currentUser?.id) {
          // Add notification for each participant
          addNotification({
            userId: participant.id,
            title: 'Новое событие',
            message: `Вы были приглашены на событие "${event.title}"`,
            type: 'event_invite',
            isRead: false,
            relatedId: event.id
          });
          
          // Add event to participant's calendar
          const participantEvent: Event = {
            ...event,
            id: `${event.id}-${participant.id}`, // Create a unique ID for each participant
          };
          
          // In a real app, this would be an API call to add the event to the user's calendar
          // For demo purposes, we just add it to our local storage
        }
      });
    }
    
    toast({
      title: "Событие создано",
      description: "Событие успешно добавлено в расписание",
    });
  };

  const updateEvent = (updatedEvent: Event) => {
    // Update multi-day flag
    if (updatedEvent.end.getTime() - updatedEvent.start.getTime() > 24 * 60 * 60 * 1000) {
      updatedEvent.isMultiDay = true;
    } else {
      updatedEvent.isMultiDay = false;
    }
    
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    
    // Notify participants about the update
    if (updatedEvent.participants && updatedEvent.participants.length > 0) {
      updatedEvent.participants.forEach(participant => {
        if (participant.id !== currentUser?.id) {
          addNotification({
            userId: participant.id,
            title: 'Обновление события',
            message: `Событие "${updatedEvent.title}" было обновлено`,
            type: 'event_update',
            isRead: false,
            relatedId: updatedEvent.id
          });
        }
      });
    }
    
    toast({
      title: "Событие обновлено",
      description: "Изменения успешно сохранены",
    });
  };

  const deleteEvent = (eventId: string) => {
    // Get the event before deletion to notify participants
    const eventToDelete = events.find(event => event.id === eventId);
    
    setEvents(events.filter(event => event.id !== eventId));
    
    // Notify participants about deletion
    if (eventToDelete && eventToDelete.participants && eventToDelete.participants.length > 0) {
      eventToDelete.participants.forEach(participant => {
        if (participant.id !== currentUser?.id) {
          addNotification({
            userId: participant.id,
            title: 'Событие отменено',
            message: `Событие "${eventToDelete.title}" было отменено`,
            type: 'event_update',
            isRead: false,
            relatedId: eventId
          });
        }
      });
    }
    
    toast({
      title: "Событие удалено",
      description: "Событие успешно удалено из расписания",
    });
  };

  // Profile update
  const updateUserProfile = (userUpdate: Partial<User>) => {
    setCurrentUser(prev => prev ? { ...prev, ...userUpdate } : null);
    
    // Sync with AuthContext
    if (updateProfile) {
      updateProfile(userUpdate);
    }
    
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные профиля успешно обновлены",
    });
  };

  // Get filtered events based on current filters
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
        notifications,
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
        sendFriendRequest: addFriend, // Map old name to new implementation
        acceptFriendRequest: acceptFriend, // Map old name to new implementation 
        declineFriendRequest: rejectFriend, // Map old name to new implementation
        removeFriend,
        updateUserProfile,
        isAuthenticated,
        // Direct references to new implementations
        addFriend,
        acceptFriend,
        rejectFriend,
        // Friend request related functions
        getFriendRequests,
        hasFriendRequest,
        // Notification functions
        markNotificationAsRead,
        clearNotifications
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
