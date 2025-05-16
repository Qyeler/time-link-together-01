
import React, { createContext, useContext, useState } from 'react';
import { Event, Group, Friend, CalendarViewMode, CalendarFilters } from '../types';

interface ScheduleContextType {
  events: Event[];
  groups: Group[];
  friends: Friend[];
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
}

const ScheduleContext = createContext<ScheduleContextType>({
  events: [],
  groups: [],
  friends: [],
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
});

export const useSchedule = () => useContext(ScheduleContext);

export const ScheduleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [filters, setFilters] = useState<CalendarFilters>({
    showPersonalEvents: true,
    showFriendEvents: true,
    showWorkEvents: true,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <ScheduleContext.Provider
      value={{
        events,
        groups,
        friends,
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
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
