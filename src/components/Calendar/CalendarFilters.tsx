
import React from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

export const CalendarFilters: React.FC = () => {
  const { filters, setFilters } = useSchedule();

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <span className="font-medium">Фильтры</span>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="personal-events"
            checked={filters.showPersonalEvents}
            onCheckedChange={(checked) => 
              setFilters({...filters, showPersonalEvents: !!checked})
            }
          />
          <Label htmlFor="personal-events" className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-indigo-500 mr-2" />
            Личные события
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="friend-events"
            checked={filters.showFriendEvents}
            onCheckedChange={(checked) => 
              setFilters({...filters, showFriendEvents: !!checked})
            }
          />
          <Label htmlFor="friend-events" className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2" />
            События с друзьями
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="work-events"
            checked={filters.showWorkEvents}
            onCheckedChange={(checked) => 
              setFilters({...filters, showWorkEvents: !!checked})
            }
          />
          <Label htmlFor="work-events" className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-rose-500 mr-2" />
            Рабочие/учебные дела
          </Label>
        </div>
      </div>
    </div>
  );
};
