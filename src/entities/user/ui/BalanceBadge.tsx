import React from 'react';
import { formatKZT } from '../../../shared/lib/format';

export interface BalanceBadgeProps {
  balance: number;
  className?: string;
  onClick?: () => void;
}

export const BalanceBadge: React.FC<BalanceBadgeProps> = ({
  balance,
  className = '',
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={`text-xs font-mono text-[#f0f6fc] border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] px-2 py-0.5 rounded-md cursor-pointer select-none transition-colors ${className}`}
      title="Баланс Kaspi Кошелька"
    >
      {formatKZT(balance)}
    </span>
  );
};
