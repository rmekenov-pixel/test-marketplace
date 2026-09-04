import React from 'react';
import type { User } from '../model/types';

export interface UserAvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={`rounded-full bg-[#30363d] text-[#f0f6fc] flex items-center justify-center font-bold uppercase overflow-hidden border border-[#484f58] shrink-0 ${sizeStyles[size]} ${className}`}
    >
      {initial}
    </div>
  );
};
