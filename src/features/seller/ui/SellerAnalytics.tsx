// src/features/seller/ui/SellerAnalytics.tsx
import React from 'react';
import { TrendingUp, Percent, Award, ArrowUpRight } from 'lucide-react';
import { useSellerStore } from '../../../entities/seller/model/sellerStore';
import { formatKZT } from '../../../shared/lib/format';

export const SellerAnalytics: React.FC = () => {
  const { metrics, products } = useSellerStore();

  const totalUnitsSold = products.reduce((sum, p) => sum + p.salesCount, 0);

  const channelBreakdown = [
    { channel: 'Прямые продажи (QazaqMarket App)', percentage: 65, amount: Math.round(metrics.totalRevenue * 0.65) },
    { channel: 'Рекомендательная витрина', percentage: 25, amount: Math.round(metrics.totalRevenue * 0.25) },
    { channel: 'Поисковый трафик', percentage: 10, amount: Math.round(metrics.totalRevenue * 0.10) },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Всего продано</span>
            <Award className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalUnitsSold} <span className="text-sm font-normal text-slate-400">книг</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% по сравнению с прошлым месяцем</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Конверсия в покупку</span>
            <Percent className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            4.2%
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+0.6% к среднему по категории</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Рейтинг магазина</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            4.9 / 5.0
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            На основе 412 отзывов покупателей
          </div>
        </div>
      </div>

      {/* Breakdown by sales channels */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          Источники заказов
        </h2>

        <div className="space-y-4">
          {channelBreakdown.map((item) => (
            <div key={item.channel} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">{item.channel}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatKZT(item.amount)} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-600 h-full rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
