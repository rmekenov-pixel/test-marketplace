import React from 'react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-8 text-center flex flex-col items-center justify-center shadow-gh text-[#f0f6fc]">
      <div className="w-10 h-10 rounded-full border border-[#30363d] bg-[#21262d] text-[#8d96a0] flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-[#f0f6fc] mb-1">{title}</h3>
      <p className="text-xs text-[#8d96a0] max-w-sm mb-4">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="secondary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
