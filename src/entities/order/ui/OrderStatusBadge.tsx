import React from 'react';
import type { OrderStatus } from '../model/types';
import { Badge } from '../../../shared/ui/Badge';

export interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'delivered':
      return <Badge className="text-[#3fb950] border-[#238636]/50 bg-[#238636]/10">Доставлен</Badge>;
    case 'processing':
      return <Badge className="text-[#58a6ff] border-[#1f6feb]/50 bg-[#1f6feb]/10">В доставке</Badge>;
    case 'cancelled':
      return <Badge className="text-[#f85149] border-[#da3633]/50 bg-[#da3633]/10">Отменен</Badge>;
    default:
      return <Badge>В обработке</Badge>;
  }
};
