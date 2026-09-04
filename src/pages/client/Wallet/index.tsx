import React, { useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { formatKZT, formatDate } from '../../../utils/format';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';

export const ClientWalletPage: React.FC = () => {
  const { user, updateBalance } = useAuthStore();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('5000');
  const [successNotice, setSuccessNotice] = useState(false);

  const presetAmounts = [2000, 5000, 10000, 20000];

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(topUpAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      updateBalance(amount);
      setIsTopUpOpen(false);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#d0d7de]">
        <h1 className="text-xl font-semibold text-[#1f2328]">
          Баланс и операции
        </h1>
        <p className="text-xs text-[#656d76]">
          Kaspi Кошелек для оплаты покупок
        </p>
      </div>

      {successNotice && (
        <div className="bg-[#f6f8fa] border border-[#d0d7de] text-[#1f2328] text-xs p-3 rounded-md flex items-center gap-2">
          <span>✓ Баланс успешно пополнен через Kaspi Gold</span>
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-white rounded-md border border-[#d0d7de] p-5 shadow-gh-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#656d76]">
            <Wallet className="w-4 h-4 stroke-[1.5]" />
            <span>Текущий доступный остаток</span>
          </div>
          <div className="text-3xl font-mono font-bold text-[#1f2328]">
            {formatKZT(user?.balance || 0)}
          </div>
          <p className="text-xs text-[#656d76]">
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
      <div className="bg-white rounded-md border border-[#d0d7de] p-4 shadow-gh-sm space-y-3">
        <h3 className="text-sm font-semibold text-[#1f2328]">
          История операций
        </h3>

        <div className="divide-y divide-[#d0d7de]">
          <div className="py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded border border-[#d0d7de] bg-[#f6f8fa] text-[#1f2328] flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-medium text-[#1f2328]">
                  Пополнение через Kaspi Gold
                </div>
                <div className="text-[11px] text-[#656d76]">
                  {formatDate(new Date(Date.now() - 3600000 * 2).toISOString())}
                </div>
              </div>
            </div>
            <span className="font-mono font-semibold text-[#1f2328]">
              +15 000 ₸
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded border border-[#d0d7de] bg-[#f6f8fa] text-[#1f2328] flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-medium text-[#1f2328]">
                  Оплата заказа: Абай жолы
                </div>
                <div className="text-[11px] text-[#656d76]">
                  {formatDate(new Date(Date.now() - 86400000 * 4).toISOString())}
                </div>
              </div>
            </div>
            <span className="font-mono text-[#656d76]">
              -12 500 ₸
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded border border-[#d0d7de] bg-[#f6f8fa] text-[#1f2328] flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-medium text-[#1f2328]">
                  Приветственный бонус
                </div>
                <div className="text-[11px] text-[#656d76]">
                  {formatDate(new Date(Date.now() - 86400000 * 10).toISOString())}
                </div>
              </div>
            </div>
            <span className="font-mono font-semibold text-[#1f2328]">
              +32 500 ₸
            </span>
          </div>
        </div>
      </div>

      {/* Top up Modal */}
      <Modal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        title="Пополнение баланса"
        maxWidth="sm"
      >
        <form onSubmit={handleTopUp} className="space-y-3">
          <Input
            label="Сумма пополнения (₸)"
            type="number"
            min="500"
            max="1000000"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-[#656d76] mb-1">
              Быстрый выбор
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt.toString())}
                  className={`py-1.5 px-2 rounded-md text-xs font-mono font-medium border ${
                    topUpAmount === amt.toString()
                      ? 'bg-[#1f2328] text-white border-[#1f2328]'
                      : 'bg-[#f6f8fa] text-[#1f2328] border-[#d0d7de] hover:bg-[#ebf0f4]'
                  }`}
                >
                  +{formatKZT(amt)}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsTopUpOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Пополнить счет
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
