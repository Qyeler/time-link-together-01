
import React from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Event } from '../../types';

// Helper function to get days in a month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export const MonthCalendar: React.FC = () => {
  const { selectedDate, events } = useSchedule();
  
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  
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
  
  // Filter events for the current month view
  const getEventsForDay = (date: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
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
            
            <div className="mt-1">
              {getEventsForDay(day.date).slice(0, 3).map((event, i) => (
                <div 
                  key={i}
                  className={`calendar-event calendar-event-${event.type}`}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              
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
