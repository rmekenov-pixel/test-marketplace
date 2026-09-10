import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLang, type Language } from '../../shared/lib/i18n/useLang';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { lang, setLang } = useLang();

  return (
    <footer className="w-full bg-[#0a0a0c] border-t border-zinc-800 py-12 transition-colors mt-auto text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-8 border-b border-zinc-800/80">
          {/* Col 1: About */}
          <div className="space-y-3">
            <div className="text-sm font-black tracking-tight text-white uppercase">
              QazaqMarket
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Главный книжный маркетплейс Казахстана. Классическая и современная казахская, мировая и деловая литература с быстрой доставкой во все регионы страны.
            </p>
          </div>

          {/* Col 2: Buyers */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Покупателям
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/catalog" className="hover:text-white transition-colors">
                  {t('nav.catalog') || 'Каталог книг'}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Избранные книги
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Корзина и чекаут
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Отслеживание заказов
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sellers & Partners */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Партнерам
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/seller" className="hover:text-white transition-colors">
                  Кабинет продавца
                </Link>
              </li>
              <li>
                <Link to="/seller/products" className="hover:text-white transition-colors">
                  Размещение изданий
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-white transition-colors">
                  Регистрация издательства
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Support */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Поддержка
            </div>
            <p className="text-xs text-zinc-400">
              Служба заботы о клиентах:
            </p>
            <div className="text-xs font-mono text-zinc-300">
              support@qazaqmarket.kz
            </div>
            <div className="text-xs text-zinc-400">
              Казахстан, Алматы / Астана
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} QazaqMarket. Все права защищены.
          </div>

          <div className="flex items-center gap-1 border border-zinc-800 bg-zinc-900/60 rounded p-0.5">
            {(['ru', 'kk', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                  lang === l
                    ? 'bg-zinc-100 text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {l === 'kk' ? 'KZ' : l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
