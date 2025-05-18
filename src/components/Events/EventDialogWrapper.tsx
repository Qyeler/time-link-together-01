
import React from 'react';
import { EventDialog } from './EventDialog';
import { useSchedule } from '../../context/ScheduleContext';

export const EventDialogWrapper: React.FC = () => {
  const { selectedEvent, setSelectedEvent } = useSchedule();
  
  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <EventDialog 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        title="Добавить событие"
      />
    </div>
  );
};
