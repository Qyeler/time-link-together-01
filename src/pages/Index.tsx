
import React, { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { MainLayout } from '../components/Layout/MainLayout';
import { CalendarHeader } from '../components/Calendar/CalendarHeader';
import { MonthCalendar } from '../components/Calendar/MonthCalendar';
import { CalendarFilters } from '../components/Calendar/CalendarFilters';
import { EventDialog } from '../components/Events/EventDialog';
import { EventDetails } from '../components/Events/EventDetails';
import { useSchedule } from '../context/ScheduleContext';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

const Index = () => {
  const { selectedDate, setSelectedDate, viewMode, setViewMode } = useSchedule();
  const [showEventDialog, setShowEventDialog] = useState(false);
  
  const handlePrevMonth = () => {
    const newDate = subMonths(selectedDate, 1);
    setSelectedDate(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = addMonths(selectedDate, 1);
    setSelectedDate(newDate);
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
        
        {/* View mode selector */}
        <div className="mb-4 flex justify-center">
          <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <TabsList>
              <TabsTrigger value="month">Месяц</TabsTrigger>
              <TabsTrigger value="week">Неделя</TabsTrigger>
              <TabsTrigger value="day">День</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
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
        
        <EventDetails />
      </div>
    </MainLayout>
  );
};

export default Index;
