
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Check, X, MessageCircle } from 'lucide-react';
import { Friend, User } from '../../types';

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
  // Display friend information
  return (
    <div className="flex items-center justify-between bg-secondary/20 p-4 rounded-lg">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={friend.avatar} />
          <AvatarFallback>{friend.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{friend.name}</div>
          <div className="text-sm text-muted-foreground">
            {friend.email || `user${friend.id}@example.com`}
          </div>
          {isPending && (
            <div className="text-xs text-blue-500 mt-1">
              Запрос от: {friend.name}
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
            <a href={`/messages?id=${friend.id}`}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Сообщение
            </a>
          </Button>
          
          {onRemove && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onRemove(friend.id)}
            >
              Удалить
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
