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
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Заказ успешно оформлен!
        </h1>

        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
          Номер вашего заказа: <span className="font-bold text-slate-900 dark:text-slate-100">{order.id}</span>
        </p>
      </div>

      {/* Order Details Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
          <span className="text-slate-500">Способ оплаты:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 uppercase">
            {order.paymentMethod === 'kaspi_qr' ? 'Kaspi QR' : 'Банковская карта'}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
          <span className="text-slate-500">Адрес доставки:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{order.deliveryAddress}</span>
        </div>

        {/* Items snapshot */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Состав заказа:
          </span>
          {order.items.map((item) => (
            <div key={item.bookId} className="flex justify-between items-center text-xs py-1">
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-xs">
                {item.title} <span className="text-slate-400">x{item.quantity}</span>
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatKZT(item.priceAtOrder * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-slate-100">
          <span>Сумма к оплате:</span>
          <span className="text-base text-sky-600 dark:text-sky-400">{formatKZT(order.totalPrice)}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/dashboard"
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Перейти в мои заказы</span>
        </Link>
        <Link
          to="/catalog"
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded transition-colors"
        >
          <span>Продолжить покупки</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
