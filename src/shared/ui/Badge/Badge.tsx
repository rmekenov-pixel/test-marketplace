import React from 'react';
import type { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'red' | 'green' | 'yellow' | 'gray' | 'blue';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.2 font-medium rounded-full',
    md: 'text-xs px-2 py-0.5 font-medium rounded-full',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border border-[#30363d] bg-[#21262d] text-[#e6edf3] ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
