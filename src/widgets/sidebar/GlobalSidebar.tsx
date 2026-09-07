import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  X,
  Home,
  LayoutGrid,
  Heart,
  ShoppingBag,
  LayoutDashboard,
  Store,
  ShieldCheck,
  Sun,
  Moon,
  LogIn,
  LogOut,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useUiStore } from '../../shared/lib/ui/useUiStore';
import { useAuthStore } from '../../entities/user/model/authStore';
import { useCartStore } from '../../entities/cart/model/cartStore';
import { useWishlistStore } from '../../entities/wishlist/model/wishlistStore';
import { useTheme } from '../../shared/lib/theme/useTheme';
import { useLang, type Language } from '../../shared/lib/i18n/useLang';

interface CategoryItem {
  id: string;
  nameKz: string;
  nameRu: string;
  subKz: string;
  subRu: string;
  genre: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'classic',
    nameKz: 'Қазақ классикасы',
    nameRu: 'Казахская классика',
    subKz: 'Әуезов, Нұрпейісов',
    subRu: 'Ауэзов, Нурпеисов',
    genre: 'classic',
  },
  {
    id: 'history',
    nameKz: 'Тарих және шежіре',
    nameRu: 'История и летописи',
    subKz: 'Есенберлин, Мағауин',
    subRu: 'Есенберлин, Магауин',
    genre: 'history',
  },
  {
    id: 'business',
    nameKz: 'Бизнес және қаржы',
    nameRu: 'Бизнес и финансы',
    subKz: 'Қаржылық сауат',
    subRu: 'Финансовая грамотность',
    genre: 'business',
  },
  {
    id: 'psychology',
    nameKz: 'Психология және даму',
    nameRu: 'Психология и развитие',
    subKz: 'Мотивация, ойлау',
    subRu: 'Мотивация, мышление',
    genre: 'psychology',
  },
  {
    id: 'children',
    nameKz: 'Балалар әдебиеті',
    nameRu: 'Детская литература',
    subKz: 'Ертегілер, танымдық',
    subRu: 'Сказки, познавательное',
    genre: 'children',
  },
  {
    id: 'world',
    nameKz: 'Әлем әдебиеті',
    nameRu: 'Мировая литература',
    subKz: 'Аудармалар',
    subRu: 'Переводы, бестселлеры',
    genre: 'world',
  },
  {
    id: 'poetry',
    nameKz: 'Поэзия',
    nameRu: 'Поэзия',
    subKz: 'Абай, Мұқағали',
    subRu: 'Абай, Мукагали',
    genre: 'poetry',
  },
  {
    id: 'it',
    nameKz: 'IT және бағдарламалау',
    nameRu: 'IT и программирование',
    subKz: 'Бағдарламалау',
    subRu: 'Разработка, алгоритмы',
    genre: 'it',
  },
];

export const GlobalSidebar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSidebarOpen, closeSidebar } = useUiStore();
  const { user, isAuthenticated, role, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();
  const { getTotalCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const cartCount = getTotalCount();
  const wishlistCount = wishlistItems.length;

  const normalizedRole = (role || '').toString().toLowerCase();
  const isAdmin = normalizedRole === 'admin';
  const isSeller = normalizedRole === 'seller' || isAdmin;

  // Close sidebar on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, closeSidebar]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleCategoryClick = (genre: string) => {
    closeSidebar();
    navigate(`/catalog?genre=${genre}`);
  };

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Боковое меню"
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded bg-sky-600 dark:bg-sky-500 text-white flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                QazaqMarket
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Кітап маркетплейсі
              </span>
            </div>
          </Link>

          <button
            onClick={closeSidebar}
            className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
              {lang === 'kk' ? 'Басты мәзір' : 'Главное меню'}
            </div>
            <nav className="space-y-1 text-sm">
              <NavLink
                to="/"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Home className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>{lang === 'kk' ? 'Басты бет' : 'Главная страница'}</span>
              </NavLink>

              <NavLink
                to="/catalog"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{lang === 'kk' ? 'Тауарлар каталогы' : 'Каталог товаров'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {lang === 'kk' ? 'Барлығы' : 'Все'}
                </span>
              </NavLink>

              <NavLink
                to="/wishlist"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{lang === 'kk' ? 'Таңдаулылар' : 'Избранное'}</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/cart"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{lang === 'kk' ? 'Себет' : 'Корзина'}</span>
                </div>
                {cartCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-600 text-white font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {isAuthenticated && (
                <NavLink
                  to="/dashboard"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{lang === 'kk' ? 'Жеке кабинет' : 'Личный кабинет'}</span>
                </NavLink>
              )}

              {isAuthenticated && isSeller && (
                <NavLink
                  to="/seller"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === 'kk' ? 'Сатушы кабинеті' : 'Кабинет продавца'}</span>
                </NavLink>
              )}

              {isAuthenticated && isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{lang === 'kk' ? 'Әкімшілік панелі' : 'Админ-панель'}</span>
                </NavLink>
              )}
            </nav>
          </div>

          {/* Quick Settings: Language & Theme */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-800">
            {/* Language Switcher */}
            <div className="flex items-center justify-center p-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
              {(['kk', 'ru', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-1 text-[11px] uppercase font-bold rounded transition-colors ${
                    lang === l
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {l === 'kk' ? 'KZ' : l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span>{lang === 'kk' ? 'Күңгірт' : 'Тёмная'}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'kk' ? 'Жарық' : 'Светлая'}</span>
                </>
              )}
            </button>
          </div>

          {/* Categories Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
              {lang === 'kk' ? 'Санаттар' : 'Категории'}
            </div>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const title = lang === 'kk' ? cat.nameKz : cat.nameRu;
                const sub = lang === 'kk' ? cat.subKz : cat.subRu;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.genre)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left rounded hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 truncate">
                        {title}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {sub}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Profile / Auth Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between gap-3">
              <Link
                to="/profile"
                onClick={closeSidebar}
                className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize truncate">
                    {isAdmin ? 'Администратор' : isSeller ? 'Продавец' : 'Покупатель'}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeSidebar();
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                title={t('nav.logout')}
                aria-label="Выйти"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={closeSidebar}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>{lang === 'kk' ? 'Кіру / Тіркелу' : 'Войти в аккаунт'}</span>
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
};
