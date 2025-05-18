
export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface Friend extends User {
  status: 'pending' | 'accepted' | 'declined';
  addedBy: string; // ID пользователя, который добавил друга
  toUserId: string; // ID пользователя, которому отправлен запрос
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  isMultiDay?: boolean; // New flag for multi-day events
  location?: string;
  color: string;
  type: 'personal' | 'friend' | 'group' | 'work';
  createdBy: string;
  participants?: User[];
  groupId?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    until?: Date;
  };
}

export interface PrivacySettings {
  whoCanSeeSchedule: 'all' | 'friends' | 'none';
  whoCanInvite: 'all' | 'friends' | 'none';
  whoCanMessage: 'all' | 'friends' | 'none';
  whoCanSeeProfile: 'all' | 'friends' | 'none';
}

export type CalendarViewMode = 'month' | 'week' | 'day' | 'custom';

export interface CalendarFilters {
  showPersonalEvents: boolean;
  showFriendEvents: boolean;
  showWorkEvents: boolean;
}

// New interface for friend requests
export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

// Type for chat messages
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

// Notification type
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'friend_request' | 'event_invite' | 'event_update' | 'system';
  isRead: boolean;
  createdAt: Date;
  relatedId?: string; // ID связанного объекта (события, друга и т.д.)
}
