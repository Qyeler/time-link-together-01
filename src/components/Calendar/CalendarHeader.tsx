
import React from 'react';
import { ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useSchedule } from '../../context/ScheduleContext';

interface CalendarHeaderProps {
  onPrev: () => void;
  onNext: () => void;
  onCreateEvent: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  onPrev,
  onNext,
  onCreateEvent
}) => {
  const { viewMode, setViewMode, selectedDate } = useSchedule();

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    return selectedDate.toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <Button onClick={onCreateEvent} className="bg-primary text-primary-foreground flex items-center space-x-2">
          <Edit2 className="h-4 w-4" />
          <span>Редактировать расписание</span>
        </Button>
      </div>

      <div className="flex space-x-2 items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={onPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[180px] text-center">
            {formatDate()}
          </h2>
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2 ml-4">
          <Select
            value={viewMode}
            onValueChange={(value) => setViewMode(value as any)}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Вид" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="day">День</SelectItem>
              <SelectItem value="custom">Произвольно</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
