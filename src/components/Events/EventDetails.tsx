
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Users, X, Edit } from 'lucide-react';
import { useSchedule } from '../../context/ScheduleContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter, 
  DialogClose 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { EventDialog } from './EventDialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '../ui/alert-dialog';

export const EventDetails: React.FC = () => {
  const { selectedEvent, setSelectedEvent, deleteEvent } = useSchedule();
  const [isEditing, setIsEditing] = useState(false);

  if (!selectedEvent) return null;

  const handleDelete = () => {
    deleteEvent(selectedEvent.id);
    setSelectedEvent(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const getEventTypeText = (type: string) => {
    switch(type) {
      case 'personal': return 'Личное событие';
      case 'friend': return 'Событие с друзьями';
      case 'group': return 'Групповое событие';
      case 'work': return 'Рабочее/учебное дело';
      default: return 'Событие';
    }
  };

  const getEventTypeClass = (type: string) => {
    switch(type) {
      case 'personal': return 'bg-indigo-500 text-white';
      case 'friend': return 'bg-emerald-500 text-white';
      case 'group': return 'bg-amber-500 text-white';
      case 'work': return 'bg-rose-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <>
      <Dialog open={!!selectedEvent && !isEditing} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div className={`px-2 py-1 rounded text-xs ${getEventTypeClass(selectedEvent.type)}`}>
                {getEventTypeText(selectedEvent.type)}
              </div>
              <DialogClose className="rounded-full h-6 w-6 p-0 flex items-center justify-center">
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
            <DialogTitle className="text-xl mt-2">{selectedEvent.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedEvent.description && (
              <div className="text-sm text-muted-foreground">
                {selectedEvent.description}
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {format(new Date(selectedEvent.start), 'PPP', { locale: ru })}
                {selectedEvent.isMultiDay && ' - ' + format(new Date(selectedEvent.end), 'PPP', { locale: ru })}
              </span>
            </div>
            
            {selectedEvent.location && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{selectedEvent.location}</span>
              </div>
            )}
            
            {selectedEvent.participants && selectedEvent.participants.length > 0 && (
              <>
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Участники ({selectedEvent.participants.length})
                  </h4>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center space-x-2 bg-secondary/30 p-1 rounded">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{participant.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Удалить</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить событие?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Событие "{selectedEvent.title}" будет удалено из вашего расписания.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for editing */}
      <EventDialog 
        open={isEditing}
        onOpenChange={(open) => {
          setIsEditing(open);
          if (!open) setSelectedEvent(selectedEvent); // Force refresh the view
        }}
        editingEvent={selectedEvent}
      />
    </>
  );
};
