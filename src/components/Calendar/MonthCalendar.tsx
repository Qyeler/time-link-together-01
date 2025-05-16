
import React from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Event } from '../../types';
import { differenceInDays, isSameDay, isWithinInterval, addDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

// Helper function to get days in a month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export const MonthCalendar: React.FC = () => {
  const { selectedDate, events, setSelectedEvent, viewMode } = useSchedule();
  
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  
  // Для недельного отображения
  if (viewMode === 'week') {
    return <WeekCalendar selectedDate={selectedDate} events={events} setSelectedEvent={setSelectedEvent} />;
  }
  
  // Для дневного отображения
  if (viewMode === 'day') {
    return <DayCalendar selectedDate={selectedDate} events={events} setSelectedEvent={setSelectedEvent} />;
  }
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Adjust first day to make Monday the first day of the week (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
  
  // Create calendar days array
  const days = [];
  
  // Add previous month's days
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      currentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i)
    });
  }
  
  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      currentMonth: true,
      date: new Date(year, month, i),
      isToday: new Date(year, month, i).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
    });
  }
  
  // Add next month's days to complete the calendar (6 rows of 7 days)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      currentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }
  
  // Filter events for the current month view, including multi-day events
  const getEventsForDay = (date: Date): Event[] => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // Если это многодневное событие
      if (event.isMultiDay) {
        return isWithinInterval(date, { start: eventStart, end: eventEnd });
      }
      
      // Иначе проверяем только совпадение дат
      return (
        eventStart.getDate() === date.getDate() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Handle event click
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  // Get color class for event type
  const getEventColorClass = (event: Event) => {
    switch (event.type) {
      case 'personal': 
        return 'bg-indigo-500 text-white';
      case 'friend': 
        return 'bg-emerald-500 text-white';
      case 'group': 
        return 'bg-amber-500 text-white';
      case 'work': 
        return 'bg-rose-500 text-white';
      default: 
        return 'bg-slate-500 text-white';
    }
  };
  
  // Weekday headers (Monday to Sunday)
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-border">
        {weekdays.map((day, index) => (
          <div key={index} className="p-2 text-center text-sm font-medium bg-secondary/30">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-border">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`min-h-[100px] p-1 ${
              day.currentMonth 
                ? day.isToday 
                  ? 'bg-primary/5'
                  : 'bg-white' 
                : 'bg-muted/30 text-muted-foreground'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium p-1 ${
                day.isToday ? 'rounded-full bg-primary text-primary-foreground h-7 w-7 flex items-center justify-center' : ''
              }`}>
                {day.day}
              </span>
            </div>
            
            <div className="mt-1 space-y-1">
              {getEventsForDay(day.date).slice(0, 3).map((event, i) => {
                // Определяем, является ли событие первым или последним днем для многодневных событий
                const isFirstDay = isSameDay(day.date, event.start);
                const isLastDay = isSameDay(day.date, event.end);
                
                return (
                  <div 
                    key={i}
                    className={`
                      text-xs truncate rounded px-2 py-1 cursor-pointer hover:opacity-80 
                      ${getEventColorClass(event)}
                      ${event.isMultiDay && !isFirstDay ? 'rounded-l-none' : ''}
                      ${event.isMultiDay && !isLastDay ? 'rounded-r-none' : ''}
                    `}
                    title={event.title}
                    onClick={() => handleEventClick(event)}
                  >
                    {event.title}
                  </div>
                );
              })}
              
              {getEventsForDay(day.date).length > 3 && (
                <div className="text-xs text-muted-foreground mt-1">
                  +{getEventsForDay(day.date).length - 3} еще
                </div>
              )}
              
              {getEventsForDay(day.date).length === 0 && day.currentMonth && (
                <div className="text-xs text-muted-foreground italic mt-2">
                  нет событий на день
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент недельного вида календаря
const WeekCalendar: React.FC<{
  selectedDate: Date;
  events: Event[];
  setSelectedEvent: (event: Event | null) => void;
}> = ({ selectedDate, events, setSelectedEvent }) => {
  // Получаем начало недели (понедельник)
  const getWeekStart = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // корректировка для недели, начинающейся с понедельника
    return new Date(date.setDate(diff));
  };

  const weekStart = getWeekStart(new Date(selectedDate));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Часы дня
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Получение событий для конкретного дня и часа
  const getEventsForHour = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getHours() === hour
      );
    });
  };
  
  // Получение цвета для типа события
  const getEventColorClass = (event: Event) => {
    switch (event.type) {
      case 'personal': return 'bg-indigo-500 text-white';
      case 'friend': return 'bg-emerald-500 text-white';
      case 'group': return 'bg-amber-500 text-white';
      case 'work': return 'bg-rose-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  // Дни недели для заголовка
  const weekdayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Заголовок с днями недели */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 text-center text-sm font-medium"></div> {/* Пустая ячейка для часов */}
          {weekDays.map((day, index) => (
            <div key={index} className="p-2 text-center border-l">
              <div className="font-medium">{weekdayNames[index]}</div>
              <div className="text-sm text-muted-foreground">{day.getDate()}</div>
            </div>
          ))}
        </div>
        
        {/* Сетка часов и событий */}
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b">
            <div className="p-2 text-right text-sm text-muted-foreground border-r">
              {hour}:00
            </div>
            
            {weekDays.map((day, dayIndex) => {
              const eventsForThisHour = getEventsForHour(day, hour);
              return (
                <div key={dayIndex} className="p-1 border-l min-h-[60px]">
                  {eventsForThisHour.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 mb-1 rounded truncate cursor-pointer ${getEventColorClass(event)}`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент дневного вида календаря
const DayCalendar: React.FC<{
  selectedDate: Date;
  events: Event[];
  setSelectedEvent: (event: Event | null) => void;
}> = ({ selectedDate, events, setSelectedEvent }) => {
  // Часы дня
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Получение событий для конкретного часа
  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getHours() === hour
      );
    });
  };
  
  // Получение цвета для типа события
  const getEventColorClass = (event: Event) => {
    switch (event.type) {
      case 'personal': return 'bg-indigo-500 text-white';
      case 'friend': return 'bg-emerald-500 text-white';
      case 'group': return 'bg-amber-500 text-white';
      case 'work': return 'bg-rose-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">
          {selectedDate.getDate()} / {selectedDate.getMonth() + 1} / {selectedDate.getFullYear()}
        </h2>
      </div>
      
      <div className="divide-y">
        {hours.map(hour => (
          <div key={hour} className="flex p-2">
            <div className="w-16 text-right pr-4 text-sm text-muted-foreground">
              {hour}:00
            </div>
            <div className="flex-1 min-h-[60px]">
              {getEventsForHour(hour).map((event, index) => (
                <div
                  key={index}
                  className={`p-2 mb-1 rounded cursor-pointer ${getEventColorClass(event)}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="font-medium">{event.title}</div>
                  {event.location && (
                    <div className="text-xs opacity-80">{event.location}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
