
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Check, X, MessageCircle } from 'lucide-react';
import { Friend, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSchedule } from '../../context/ScheduleContext';

interface FriendItemProps {
  friend: Friend;
  isPending?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export const FriendItem: React.FC<FriendItemProps> = ({ 
  friend, 
  isPending = false, 
  onAccept, 
  onReject, 
  onRemove 
}) => {
  const { user } = useAuth();
  const { allUsers } = useSchedule();
  
  // Определяем ID и данные друга в зависимости от того, кто кого добавил
  const friendId = friend.addedBy === user?.id ? friend.toUserId : friend.addedBy;
  
  // Находим детальную информацию о друге из списка всех пользователей
  const friendInfo = allUsers.find(u => u.id === friendId);
  
  // Используем найденную информацию или данные из объекта friend
  const friendName = friendInfo?.name || friend.name;
  const friendEmail = friendInfo?.email || friend.email || `user${friendId}@example.com`;
  const friendAvatar = friendInfo?.avatar || friend.avatar;
  
  return (
    <div className="flex items-center justify-between bg-secondary/20 p-4 rounded-lg">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={friendAvatar} />
          <AvatarFallback>{friendName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{friendName}</div>
          <div className="text-sm text-muted-foreground">
            {friendEmail}
          </div>
          {isPending && (
            <div className="text-xs text-blue-500 mt-1">
              Запрос от: {friend.addedBy === user?.id ? "Вас" : friendName}
            </div>
          )}
        </div>
      </div>
      
      {isPending ? (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {onAccept && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onAccept(friend.id)}
            >
              <Check className="mr-2 h-4 w-4" />
              Принять
            </Button>
          )}
          
          {onReject && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReject(friend.id)}
            >
              <X className="mr-2 h-4 w-4" />
              Отклонить
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <a href={`/messages?id=${friendId}`}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Сообщение
            </a>
          </Button>
          
          {onRemove && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onRemove(friendId)}
            >
              Удалить
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
