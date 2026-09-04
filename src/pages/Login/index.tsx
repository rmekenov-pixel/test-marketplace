import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User as UserIcon, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [selectedRole, setSelectedRole] = useState<Role>('client');
  const [name, setName] = useState('Арыстан Сериков');
  const [email, setEmail] = useState('aristan@kitap.kz');
  const [phone, setPhone] = useState('+7 (777) 123-45-67');

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setName('Администратор Магазина');
      setEmail('admin@kitap.kz');
      setPhone('+7 (701) 999-88-77');
    } else {
      setName('Арыстан Сериков');
      setEmail('aristan@kitap.kz');
      setPhone('+7 (777) 123-45-67');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, name, email);
    if (selectedRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/client/dashboard');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-md border border-[#d0d7de] shadow-gh-sm p-6 space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <div className="w-8 h-8 rounded-md border border-[#d0d7de] bg-[#f6f8fa] text-[#1f2328] flex items-center justify-center mb-2">
            <BookOpen className="w-4 h-4 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-semibold text-[#1f2328]">
            Вход в Kitap All
          </h2>
          <p className="text-xs text-[#656d76]">
            Выберите тип учетной записи
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
          <button
            type="button"
            onClick={() => handleRoleSelect('client')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium ${
              selectedRole === 'client'
                ? 'bg-white text-[#1f2328] font-semibold border border-[#d0d7de] shadow-gh-sm'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Покупатель</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium ${
              selectedRole === 'admin'
                ? 'bg-white text-[#1f2328] font-semibold border border-[#d0d7de] shadow-gh-sm'
                : 'text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Админ</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Имя пользователя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Телефон (Kaspi Pay)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="mt-3"
          >
            Войти как {selectedRole === 'admin' ? 'Администратор' : 'Покупатель'}
          </Button>
        </form>
      </div>
    </div>
  );
};
