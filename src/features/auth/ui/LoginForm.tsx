import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Shield, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../entities/user';
import type { UserRole } from '../../../entities/user';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [selectedRole, setSelectedRole] = useState<UserRole>('client');
  const [email, setEmail] = useState('arystan@kitapall.kz');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, {
      email,
      name: selectedRole === 'admin' ? 'Администратор Kitap All' : 'Арыстан Мекен',
    });

    if (selectedRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/client/catalog');
    }
  };

  return (
    <div className="bg-[#161b22] rounded-md border border-[#30363d] p-6 shadow-gh text-[#f0f6fc] space-y-5">
      {/* Role selector */}
      <div>
        <label className="block text-xs font-semibold text-[#8d96a0] mb-2">
          Выберите режим входа:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('client');
              setEmail('arystan@kitapall.kz');
            }}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-md border text-xs font-medium transition-colors ${
              selectedRole === 'client'
                ? 'bg-[#21262d] border-[#388bfd] text-[#f0f6fc]'
                : 'bg-[#0d1117] border-[#30363d] text-[#8d96a0] hover:text-[#f0f6fc]'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Покупатель</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setEmail('admin@kitapall.kz');
            }}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-md border text-xs font-medium transition-colors ${
              selectedRole === 'admin'
                ? 'bg-[#21262d] border-[#388bfd] text-[#f0f6fc]'
                : 'bg-[#0d1117] border-[#30363d] text-[#8d96a0] hover:text-[#f0f6fc]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Администратор</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Email или номер телефона"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          {selectedRole === 'admin' ? 'Войти в панель управления' : 'Войти в маркетплейс'}
        </Button>
      </form>
    </div>
  );
};
