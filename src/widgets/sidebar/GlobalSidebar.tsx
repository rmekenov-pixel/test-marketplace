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
import { useLang } from '../../shared/lib/i18n/useLang';

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
    genre: 'kazakh_classics',
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
    subKz: 'Қаржылық сауат, менеджмент',
    subRu: 'Финансовая грамотность',
    genre: 'business',
  },
  {
    id: 'psychology',
    nameKz: 'Психология және даму',
    nameRu: 'Психология и развитие',
    subKz: 'Мотивация, тұлғалық өсу',
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
    id: 'fiction',
    nameKz: 'Көркем әдебиет',
    nameRu: 'Художественная литература',
    subKz: 'Аудармалар, бестселлер',
    subRu: 'Переводы, бестселлеры',
    genre: 'fiction',
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
    <div className="fixed inset-0 z-50 flex text-left">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="relative w-80 max-w-[85vw] bg-white text-zinc-900 border-zinc-200 dark:bg-[#0a0a0c] dark:text-zinc-100 dark:border-zinc-800 border-r h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Боковое меню"
      >
        {/* Top Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors uppercase">
                QazaqMarket
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                Кітап маркетплейсі
              </span>
            </div>
          </Link>

          <button
            onClick={closeSidebar}
            className="p-1.5 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors"
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2 mb-2">
              {lang === 'kk' || lang === 'kz' ? 'Басты мәзір' : 'Главное меню'}
            </div>
            <nav className="space-y-1 text-sm">
              <NavLink
                to="/"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200'
                  }`
                }
              >
                <Home className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span>{lang === 'kk' || lang === 'kz' ? 'Басты бет' : 'Главная страница'}</span>
              </NavLink>

              <NavLink
                to="/catalog"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>{lang === 'kk' || lang === 'kz' ? 'Тауарлар каталогы' : 'Каталог книг'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                  {lang === 'kk' || lang === 'kz' ? 'Барлығы' : 'Все'}
                </span>
              </NavLink>

              <NavLink
                to="/wishlist"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>{lang === 'kk' || lang === 'kz' ? 'Таңдаулылар' : 'Избранное'}</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/cart"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>{lang === 'kk' || lang === 'kz' ? 'Себет' : 'Корзина'}</span>
                </div>
                {cartCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {isAuthenticated && (
                <NavLink
                  to="/dashboard"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 font-semibold'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>{lang === 'kk' || lang === 'kz' ? 'Жеке кабинет' : 'Личный кабинет'}</span>
                </NavLink>
              )}

              {isAuthenticated && isSeller && (
                <NavLink
                  to="/seller"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-100 text-emerald-600 border border-emerald-300 dark:bg-zinc-900 dark:text-emerald-400 dark:border-emerald-900/50 font-semibold'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-emerald-400'
                    }`
                  }
                >
                  <Store className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>{lang === 'kk' || lang === 'kz' ? 'Сатушы кабинеті' : 'Кабинет продавца'}</span>
                </NavLink>
              )}

              {isAuthenticated && isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 font-semibold'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-200'
                    }`
                  }
                >
                  <ShieldCheck className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span>{lang === 'kk' || lang === 'kz' ? 'Әкімшілік панелі' : 'Админ-панель'}</span>
                </NavLink>
              )}
            </nav>
          </div>

          {/* Quick Settings: Language & Theme */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-zinc-100 dark:bg-zinc-900/60 rounded border border-zinc-200 dark:border-zinc-800">
            {/* Language Switcher */}
            <div className="flex items-center justify-center p-0.5 bg-white dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800">
              {(['kk', 'ru'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`flex-1 py-1 text-[10px] uppercase font-bold rounded transition-colors ${
                    lang === l || (l === 'kk' && lang === 'kz')
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {l === 'kk' ? 'KZ' : 'RU'}
                </button>
              ))}
            </div>

            {/* Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-zinc-300" />
                  <span className="text-[11px]">{lang === 'kk' || lang === 'kz' ? 'Күңгірт' : 'Тёмная'}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px]">{lang === 'kk' || lang === 'kz' ? 'Жарық' : 'Светлая'}</span>
                </>
              )}
            </button>
          </div>

          {/* Categories Section */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2 mb-2">
              {lang === 'kk' || lang === 'kz' ? 'Санаттар' : 'Категории'}
            </div>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const title = lang === 'kk' || lang === 'kz' ? cat.nameKz : cat.nameRu;
                const sub = lang === 'kk' || lang === 'kz' ? cat.subKz : cat.subRu;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.genre)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white truncate">
                        {title}
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                        {sub}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Profile / Auth Bar */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between gap-3">
              <Link
                to="/profile"
                onClick={closeSidebar}
                className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-bold text-xs shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 capitalize truncate">
                    {isAdmin ? 'Администратор' : isSeller ? 'Продавец' : 'Покупатель'}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeSidebar();
                }}
                className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors"
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
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-semibold rounded transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>{lang === 'kk' || lang === 'kz' ? 'Кіру / Тіркелу' : 'Войти в аккаунт'}</span>
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
};
