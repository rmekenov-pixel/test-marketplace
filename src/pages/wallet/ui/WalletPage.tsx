import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuthStore } from '../../../entities/user';
import { TopUpModal } from '../../../features/wallet/top-up';
import { Button } from '../../../shared/ui/Button';
import { formatKZT, formatDate } from '../../../shared/lib/format';

export const WalletPage: React.FC = () => {
  const { user } = useAuthStore();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#30363d]">
        <h1 className="text-xl font-semibold text-[#f0f6fc]">
          Баланс и операции
        </h1>
        <p className="text-xs text-[#8d96a0]">
          Kaspi Кошелек для оплаты покупок
        </p>
      </div>

      {successNotice && (
        <div className="bg-[#238636]/10 border border-[#238636]/40 text-[#3fb950] text-xs p-3 rounded-md flex items-center gap-2">
          <span>✓ Баланс успешно пополнен через Kaspi Gold</span>
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-[#161b22] rounded-md border border-[#30363d] p-5 shadow-gh flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8d96a0]">
            <Wallet className="w-4 h-4 stroke-[1.5]" />
            <span>Текущий доступный остаток</span>
          </div>
          <div className="text-3xl font-mono font-bold text-[#f0f6fc]">
            {formatKZT(user?.balance || 0)}
          </div>
          <p className="text-xs text-[#8d96a0]">
            Аккаунт: {user?.phone} ({user?.name})
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsTopUpOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Пополнить счет
        </Button>
      </div>

      {/* History */}
      <div className="bg-[#161b22] rounded-md border border-[#30363d] p-4 shadow-gh space-y-3">
        <h3 className="text-sm font-semibold text-[#f0f6fc]">
          История операций
        </h3>

        <div className="divide-y divide-[#30363d]">
          <div className="py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded border border-[#30363d] bg-[#21262d] text-[#3fb950] flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-medium text-[#f0f6fc]">
                  Пополнение через Kaspi Gold
                </div>
                <div className="text-[11px] text-[#8d96a0]">
                  {formatDate(new Date(Date.now() - 3600000 * 2).toISOString())}
                </div>
              </div>
            </div>
            <span className="font-mono font-semibold text-[#3fb950]">
              +15 000 ₸
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded border border-[#30363d] bg-[#21262d] text-[#8d96a0] flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-medium text-[#f0f6fc]">
                  Оплата заказа: Абай жолы
                </div>
                <div className="text-[11px] text-[#8d96a0]">
                  {formatDate(new Date(Date.now() - 86400000 * 4).toISOString())}
                </div>
              </div>
            </div>
            <span className="font-mono text-[#8d96a0]">
              -12 500 ₸
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded border border-[#30363d] bg-[#21262d] text-[#3fb950] flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-medium text-[#f0f6fc]">
                  Приветственный бонус
                </div>
                <div className="text-[11px] text-[#8d96a0]">
                  {formatDate(new Date(Date.now() - 86400000 * 10).toISOString())}
                </div>
              </div>
            </div>
            <span className="font-mono font-semibold text-[#3fb950]">
              +32 500 ₸
            </span>
          </div>
        </div>
      </div>

      {/* TopUp Feature Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={() => {
          setSuccessNotice(true);
          setTimeout(() => setSuccessNotice(false), 3000);
        }}
      />
    </div>
  );
};
