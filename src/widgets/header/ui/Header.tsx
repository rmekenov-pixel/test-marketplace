import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, LogOut, BookOpen } from 'lucide-react';
import { useAuthStore, UserAvatar, BalanceBadge } from '../../../entities/user';
import { useCartStore } from '../../../entities/cart';
import { ROUTES } from '../../../shared/config/routes';

export interface HeaderProps {
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuthStore();
  const totalCartCount = useCartStore((state) => state.getTotalCount());

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const isAuthPage = location.pathname === ROUTES.LOGIN;

  return (
    <header className="sticky top-0 z-40 bg-[#161b22] border-b border-[#30363d] text-[#f0f6fc]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6 shrink-0">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 text-base font-bold text-[#f0f6fc] tracking-tight hover:text-[#58a6ff]"
            >
              <div className="w-7 h-7 rounded-md border border-[#30363d] bg-[#21262d] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[#f0f6fc] stroke-[1.75]" />
              </div>
              <span>Kitap All</span>
            </Link>

            {!isAuthPage && (
              <nav className="hidden md:flex items-center gap-4 text-xs sm:text-sm">
                <Link
                  to={ROUTES.CLIENT.CATALOG}
                  className="text-[#f0f6fc] hover:text-[#58a6ff] hover:underline"
                >
                  Каталог
                </Link>
                {role === 'admin' ? (
                  <>
                    <Link
                      to={ROUTES.ADMIN.DASHBOARD}
                      className="text-[#8d96a0] hover:text-[#f0f6fc] hover:underline"
                    >
                      Сводка
                    </Link>
                    <Link
                      to={ROUTES.ADMIN.CATALOG}
                      className="text-[#8d96a0] hover:text-[#f0f6fc] hover:underline"
                    >
                      Управление
                    </Link>
                    <Link
                      to={ROUTES.ADMIN.WAREHOUSE}
                      className="text-[#8d96a0] hover:text-[#f0f6fc] hover:underline"
                    >
                      Склад
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={ROUTES.CLIENT.ORDERS}
                      className="text-[#8d96a0] hover:text-[#f0f6fc] hover:underline"
                    >
                      Заказы
                    </Link>
                    <Link
                      to={ROUTES.CLIENT.WALLET}
                      className="text-[#8d96a0] hover:text-[#f0f6fc] hover:underline"
                    >
                      Кошелек
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Search box button */}
          {!isAuthPage && (
            <div className="flex-1 max-w-sm hidden sm:block">
              <button
                onClick={() => {
                  if (onSearchClick) onSearchClick();
                  else navigate(ROUTES.CLIENT.CATALOG);
                }}
                className="w-full flex items-center justify-between bg-[#0d1117] hover:bg-[#161b22] border border-[#30363d] rounded-md px-3 py-1.5 text-xs text-[#8d96a0] text-left shadow-inner"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-[#8d96a0]" />
                  <span>Поиск по каталогу...</span>
                </div>
                <kbd className="hidden lg:inline-block border border-[#30363d] bg-[#161b22] text-[10px] text-[#8d96a0] px-1.5 rounded font-mono">
                  /
                </kbd>
              </button>
            </div>
          )}

          {/* User actions / Balance / Cart */}
          <div className="flex items-center gap-3">
            {!isAuthPage && (
              <>
                {role === 'client' && (
                  <Link
                    to={ROUTES.CLIENT.CART}
                    className="relative flex items-center justify-center p-1.5 text-[#f0f6fc] hover:text-[#58a6ff] rounded-md hover:bg-[#21262d]"
                    title="Корзина"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                    {totalCartCount > 0 && (
                      <span className="ml-1.5 text-xs font-mono font-medium text-[#f0f6fc] bg-[#21262d] border border-[#30363d] px-1.5 py-0.2 rounded-full">
                        {totalCartCount}
                      </span>
                    )}
                  </Link>
                )}

                {user ? (
                  <div className="flex items-center gap-2.5">
                    {role === 'client' && (
                      <BalanceBadge
                        balance={user.balance}
                        onClick={() => navigate(ROUTES.CLIENT.WALLET)}
                      />
                    )}

                    <Link
                      to={
                        role === 'admin'
                          ? ROUTES.ADMIN.DASHBOARD
                          : ROUTES.CLIENT.DASHBOARD
                      }
                      className="flex items-center gap-2 text-xs font-medium text-[#f0f6fc] hover:text-[#58a6ff]"
                    >
                      <UserAvatar user={user} size="sm" />
                      <span className="hidden sm:inline">
                        {user.name.split(' ')[0]}
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="p-1.5 text-[#8d96a0] hover:text-[#f0f6fc] hover:bg-[#21262d] rounded-md"
                      title="Выйти"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to={ROUTES.LOGIN}
                    className="border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] px-3 py-1 text-xs font-medium rounded-md"
                  >
                    Войти
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
