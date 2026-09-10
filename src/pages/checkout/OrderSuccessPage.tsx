import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatKZT } from '../../shared/lib/format';
import type { Order } from '../../entities/order/model/types';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const order = (location.state as { order?: Order })?.order;

  if (!order) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="max-w-xl mx-auto py-12 space-y-8">
      {/* Header Banner */}
      <div className="text-left space-y-3 border-b border-zinc-800 pb-6">
        <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-zinc-100">
          Заказ успешно оформлен
        </h1>

        <p className="text-xs text-zinc-400 font-mono">
          Номер вашего заказа: <span className="font-bold text-zinc-100">{order.id}</span>
        </p>
      </div>

      {/* Order Details Card */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
          <span className="text-zinc-500">Способ оплаты:</span>
          <span className="font-mono font-semibold text-zinc-100 uppercase">
            {order.paymentMethod === 'kaspi_qr' ? 'Kaspi QR' : 'Банковская карта'}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
          <span className="text-zinc-500">Адрес доставки:</span>
          <span className="font-semibold text-zinc-100">{order.deliveryAddress}</span>
        </div>

        {/* Items snapshot */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">
            Состав заказа:
          </span>
          {order.items.map((item) => (
            <div key={item.bookId} className="flex justify-between items-center text-xs py-1">
              <span className="text-zinc-300 truncate max-w-xs">
                {item.title} <span className="text-zinc-500 font-mono">x{item.quantity}</span>
              </span>
              <span className="font-mono font-semibold text-zinc-100">
                {formatKZT(item.priceAtOrder * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-sm font-bold text-zinc-100">
          <span>Сумма к оплате:</span>
          <span className="text-base font-mono text-zinc-100">{formatKZT(order.totalPrice)}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/dashboard"
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Перейти в мои заказы</span>
        </Link>
        <Link
          to="/catalog"
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-semibold rounded transition-colors"
        >
          <span>Продолжить покупки</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
