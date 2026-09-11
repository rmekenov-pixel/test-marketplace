import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLang } from '../../shared/lib/i18n/useLang';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useLang();

  return (
    <footer className="w-full bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-[#0a0a0c] dark:text-zinc-400 border-t dark:border-zinc-800 py-12 transition-colors mt-auto text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-16 md:gap-y-10 mb-10 pb-8 border-b border-zinc-200 dark:border-zinc-800/80">
          {/* Row 1, Col 1 (Top-Left): About / QazaqMarket */}
          <div className="space-y-3">
            <div className="text-sm font-black tracking-tight text-zinc-950 dark:text-white uppercase">
              QazaqMarket
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              {lang === 'kk' || lang === 'kz'
                ? 'Қазақстанның жетекші кітап маркетплейсі. Ұлттық классика, әлемдік бестселлерлер мен ресми баспалардан тікелей жеткізу.'
                : 'Главный книжный маркетплейс Казахстана. Классическая и современная казахская, мировая и деловая литература с быстрой доставкой во все регионы страны.'}
            </p>
          </div>

          {/* Row 1, Col 2 (Top-Right): Buyers / Покупателям */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider">
              {lang === 'kk' || lang === 'kz' ? 'Оқырмандарға' : 'Покупателям'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/catalog" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {t('nav.catalog') || 'Каталог книг'}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {lang === 'kk' || lang === 'kz' ? 'Таңдаулы кітаптар' : 'Избранные книги'}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {lang === 'kk' || lang === 'kz' ? 'Себет және тапсырыс' : 'Корзина и чекаут'}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {lang === 'kk' || lang === 'kz' ? 'Тапсырыс мәртебесі' : 'Отслеживание заказов'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Row 2, Col 1 (Bottom-Left): Contacts & Support / Поддержка */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider">
              {lang === 'kk' || lang === 'kz' ? 'Қолдау қызметі' : 'Поддержка'}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {lang === 'kk' || lang === 'kz' ? 'Тұтынушыларға қызмет көрсету:' : 'Служба заботы о клиентах:'}
            </p>
            <div className="text-xs font-mono text-zinc-800 dark:text-zinc-300">
              support@qazaqmarket.kz
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Қазақстан, Алматы / Астана
            </div>
          </div>

          {/* Row 2, Col 2 (Bottom-Right): Sellers & Partners / Партнерам */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider">
              {lang === 'kk' || lang === 'kz' ? 'Серіктестерге' : 'Партнерам'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/seller" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {lang === 'kk' || lang === 'kz' ? 'Сатушы кабинеті' : 'Кабинет продавца'}
                </Link>
              </li>
              <li>
                <Link to="/seller/products" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {lang === 'kk' || lang === 'kz' ? 'Кітаптарды орналастыру' : 'Размещение изданий'}
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {lang === 'kk' || lang === 'kz' ? 'Баспаны тіркеу' : 'Регистрация издательства'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} QazaqMarket. {lang === 'kk' || lang === 'kz' ? 'Барлық құқықтар қорғалған.' : 'Все права защищены.'}
          </div>
        </div>
      </div>
    </footer>
  );
};
