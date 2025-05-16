
import React, { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { MainLayout } from '../components/Layout/MainLayout';
import { CalendarHeader } from '../components/Calendar/CalendarHeader';
import { MonthCalendar } from '../components/Calendar/MonthCalendar';
import { CalendarFilters } from '../components/Calendar/CalendarFilters';
import { EventDialog } from '../components/Events/EventDialog';
import { useSchedule } from '../context/ScheduleContext';

const Index = () => {
  const { setSelectedDate } = useSchedule();
  const [showEventDialog, setShowEventDialog] = useState(false);
  
  const handlePrevMonth = () => {
    setSelectedDate(prevDate => subMonths(prevDate, 1));
  };
  
  const handleNextMonth = () => {
    setSelectedDate(prevDate => addMonths(prevDate, 1));
  };
  
  const handleCreateEvent = () => {
    setShowEventDialog(true);
  };
  
  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <CalendarHeader 
          onPrev={handlePrevMonth} 
          onNext={handleNextMonth}
          onCreateEvent={handleCreateEvent}
        />
        
        <div className="flex flex-1 gap-4">
          <div className="flex-1">
            <MonthCalendar />
          </div>
          
          <div className="hidden lg:block w-64">
            <CalendarFilters />
          </div>
        </div>
        
        <EventDialog 
          open={showEventDialog}
          onOpenChange={setShowEventDialog}
        />
      </div>
    </MainLayout>
  );
};

export default Index;
