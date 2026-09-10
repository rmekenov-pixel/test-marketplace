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
        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Всего продано</span>
            <Award className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {totalUnitsSold} <span className="text-xs font-normal text-zinc-500 font-sans">книг</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-zinc-300 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            <span>+18.4% к прошлому месяцу</span>
          </div>
        </div>

        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Конверсия</span>
            <Percent className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            4.2%
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-zinc-300 font-mono">
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            <span>+0.6% к среднему по категории</span>
          </div>
        </div>

        <div className="p-5 bg-zinc-950 border border-zinc-800 rounded">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Рейтинг магазина</span>
            <TrendingUp className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            4.9 / 5.0
          </div>
          <div className="mt-2 text-[11px] text-zinc-500 font-mono">
            На основе 412 отзывов покупателей
          </div>
        </div>
      </div>

      {/* Breakdown by sales channels */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300">
          Источники заказов
        </h2>

        <div className="space-y-4">
          {channelBreakdown.map((item) => (
            <div key={item.channel} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-zinc-300">{item.channel}</span>
                <span className="font-mono font-bold text-zinc-100">
                  {formatKZT(item.amount)} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="bg-white h-full rounded-full"
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
