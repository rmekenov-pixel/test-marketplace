import React, { useState } from 'react';
import { useAuthStore } from '../../../../entities/user';
import { Modal } from '../../../../shared/ui/Modal';
import { Input } from '../../../../shared/ui/Input';
import { Button } from '../../../../shared/ui/Button';
import { formatKZT } from '../../../../shared/lib/format';

export interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const updateBalance = useAuthStore((state) => state.updateBalance);
  const [topUpAmount, setTopUpAmount] = useState('5000');

  const presetAmounts = [2000, 5000, 10000, 20000];

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(topUpAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      updateBalance(amount);
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
          <label className="block text-xs font-semibold text-[#8d96a0] mb-1">
            Быстрый выбор
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setTopUpAmount(amt.toString())}
                className={`py-1.5 px-2 rounded-md text-xs font-mono font-medium border transition-colors ${
                  topUpAmount === amt.toString()
                    ? 'bg-[#1f6feb] text-white border-[#388bfd]'
                    : 'bg-[#21262d] text-[#f0f6fc] border-[#30363d] hover:bg-[#30363d]'
                }`}
              >
                +{formatKZT(amt)}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary">
            Пополнить счет
          </Button>
        </div>
      </form>
    </Modal>
  );
};
