// src/pages/product/ProductPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  CheckCircle,
  AlertCircle,
  Shield,
  Truck,
  Share2,
  Heart,
  Quote,
  Check,
} from 'lucide-react';
import { useBookStore } from '../../entities/book/model/bookStore';
import { bookApi } from '../../entities/book/api/bookApi';
import type { Book } from '../../entities/book/model/types';
import { SafeImage } from '../../shared/ui/SafeImage/SafeImage';
import { formatKZT } from '../../shared/lib/format';
import { useCartStore } from '../../entities/cart/model/cartStore';
import { useWishlistStore } from '../../entities/wishlist/model/wishlistStore';
import { useToastStore } from '../../shared/lib/toast/useToastStore';
import { ProductCard } from '../../entities/product/ui/ProductCard';

interface ReviewItem {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
}

const MOCK_REVIEWS: Record<string, ReviewItem[]> = {
  default: [
    {
      id: 'rev-1',
      author: 'Айдос Нұрланұлы',
      city: 'Алматы',
      rating: 5,
      date: '14 маусым 2026',
      comment: 'Керемет сапада басылған кітап. Мұқабасы қатты, қағазы тығыз, көзді ауыртпайды. Жеткізу 1 күнде келді.',
      isVerified: true,
    },
    {
      id: 'rev-2',
      author: 'Динара Сейфуллина',
      city: 'Астана',
      rating: 5,
      date: '28 мамыр 2026',
      comment: 'Әр қазақтың төрінде тұруы тиіс жауһар дүние. Баспа сапасы өте жоғары. Ұсыныс жасаймын!',
      isVerified: true,
    },
    {
      id: 'rev-3',
      author: 'Тимур Ибраев',
      city: 'Шымкент',
      rating: 4,
      date: '12 сәуір 2026',
      comment: 'Отличное оригинальное издание. Текст легко читается, верстка безупречная.',
      isVerified: true,
    },
  ],
};

const GENRE_LABELS: Record<string, { kz: string; ru: string }> = {
  kazakh_classics: { kz: 'Қазақ классикасы', ru: 'Казахская классика' },
  history: { kz: 'Тарих және шежіре', ru: 'История и этнография' },
  business: { kz: 'Бизнес және қаржы', ru: 'Бизнес и финансы' },
  psychology: { kz: 'Психология және даму', ru: 'Психология и саморазвитие' },
  fiction: { kz: 'Көркем әдебиет', ru: 'Художественная литература' },
  children: { kz: 'Балалар әдебиеті', ru: 'Детская литература' },
};

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { books } = useBookStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { addToast } = useToastStore();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<'hardcover' | 'paperback'>('hardcover');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    bookApi
      .getById(id)
      .then((data) => {
        setBook(data);
        if (data?.coverType) {
          setSelectedFormat(data.coverType);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-zinc-500 font-mono">
        {t('common.loading') || 'Жүктелуде...'}
      </div>
    );
  }

  if (!book) {
    return (
      <div className="py-20 text-left space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Кітап табылмады / Товар не найден
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Мүмкін бұл басылым өшірілген немесе сілтемесі өзгерген.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold rounded hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('product.backToCatalog') || 'Каталогқа оралу'}
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(book.id);

  const handleAddToCart = () => {
    if (book.stock <= 0) return;
    addItem(book.id, quantity, book.stock);
    addToast({
      type: 'success',
      message: `${book.title} (x${quantity}) ${t('product.addedToCart') || 'себетке қосылды'}`,
    });
  };

  const handleToggleWishlist = () => {
    const added = toggleItem(book.id);
    addToast({
      type: 'info',
      message: added ? 'Таңдаулыларға қосылды' : 'Таңдаулылардан алынды',
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      addToast({ type: 'success', message: 'Сілтеме буферге көшірілді' });
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isKz = i18n.language === 'kk' || i18n.language === 'kz';
  const genreName = GENRE_LABELS[book.genre]?.[isKz ? 'kz' : 'ru'] || book.genre;

  const relatedBooks = books
    .filter((b) => b.id !== book.id && (b.genre === book.genre || b.author === book.author))
    .slice(0, 4);

  return (
    <div className="space-y-12 text-left">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
        <Link to="/" className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors">
          {isKz ? 'Басты бет' : 'Главная'}
        </Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors">
          {isKz ? 'Каталог' : 'Каталог'}
        </Link>
        <span>/</span>
        <Link to={`/catalog?genre=${book.genre}`} className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors">
          {genreName}
        </Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-300 truncate max-w-[200px] sm:max-w-md font-medium">
          {book.title}
        </span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Cover Image Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="sticky top-24 aspect-[3/4] rounded border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-100 dark:bg-zinc-950 relative shadow-lg">
            <SafeImage
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            {book.stock <= 0 && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-white px-3 py-1.5 border border-zinc-700 bg-zinc-900 rounded">
                  {isKz ? 'Қолда жоқ' : 'Нет в наличии'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWishlist}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 border rounded text-xs transition-colors ${
                isLiked
                  ? 'border-zinc-900 bg-zinc-100 text-zinc-950 dark:border-zinc-500 dark:bg-zinc-900 dark:text-white'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500 dark:fill-white dark:text-white' : ''}`} />
              <span>{isLiked ? (isKz ? 'Таңдаулыда' : 'В избранном') : (isKz ? 'Таңдаулыға' : 'В избранное')}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 py-2 px-3 border border-zinc-300 bg-white hover:border-zinc-400 text-zinc-700 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded text-xs transition-colors"
              title="Бөлісу"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (isKz ? 'Көшірілді' : 'Скопировано') : (isKz ? 'Бөлісу' : 'Поделиться')}</span>
            </button>
          </div>
        </div>

        {/* Info, Buy Box and Specs */}
        <div className="md:col-span-7 space-y-6">
          {/* Title & Author */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{book.author}</span>
              {book.publisher && (
                <>
                  <span>•</span>
                  <span>{book.publisher}</span>
                </>
              )}
              {book.ageRestriction && (
                <>
                  <span>•</span>
                  <span className="px-1.5 py-0.2 border border-zinc-300 dark:border-zinc-800 rounded text-[10px] text-zinc-600 dark:text-zinc-400">
                    {book.ageRestriction}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 leading-tight">
              {book.title}
            </h1>

            {/* Ratings, Reviews, Stock */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1 text-zinc-900 dark:text-zinc-100">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500 dark:fill-zinc-200 dark:text-zinc-200" />
                <span className="font-semibold font-mono text-sm">
                  {book.rating.toFixed(1)}
                </span>
              </div>
              <span>•</span>
              <a href="#reviews" className="hover:underline font-mono">
                {book.reviewsCount} {t('product.reviews') || 'пікір'}
              </a>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                {book.stock > 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isKz ? `Қоймада бар (${book.stock} дана)` : `В наличии (${book.stock} шт.)`}
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-medium inline-flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {isKz ? 'Таусылды' : 'Нет в наличии'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              {isKz ? 'Мұқаба түрі / Формат' : 'Тип переплета / Формат'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedFormat('hardcover')}
                className={`p-3 border rounded text-left transition-colors ${
                  selectedFormat === 'hardcover'
                    ? 'border-zinc-900 bg-zinc-100 text-zinc-950 dark:border-zinc-300 dark:bg-zinc-900 dark:text-white'
                    : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-semibold">{isKz ? 'Қатты мұқаба (Hardcover)' : 'Твердый переплет'}</div>
                <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">{formatKZT(book.price)}</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('paperback')}
                className={`p-3 border rounded text-left transition-colors ${
                  selectedFormat === 'paperback'
                    ? 'border-zinc-900 bg-zinc-100 text-zinc-950 dark:border-zinc-300 dark:bg-zinc-900 dark:text-white'
                    : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-semibold">{isKz ? 'Жұмсақ мұқаба (Paperback)' : 'Мягкая обложка'}</div>
                <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {formatKZT(Math.round(book.price * 0.85))}
                </div>
              </button>
            </div>
          </div>

          {/* Pricing & Add to cart Buy Box */}
          <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded space-y-4 shadow-xs">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-zinc-950 dark:text-white font-mono tracking-tight">
                {formatKZT(selectedFormat === 'hardcover' ? book.price : Math.round(book.price * 0.85))}
              </span>
              {book.oldPrice && (
                <span className="text-sm line-through text-zinc-400 dark:text-zinc-500 font-mono">
                  {formatKZT(book.oldPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-zinc-300 dark:border-zinc-800 rounded bg-zinc-100 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                  disabled={quantity >= book.stock}
                  className="px-3 py-2 text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={book.stock <= 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 disabled:opacity-30 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t('product.addToCart') || 'Себетке салу'}</span>
              </button>
            </div>

            {/* Delivery & Assurance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-zinc-800 dark:text-zinc-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-zinc-900 dark:text-zinc-200 font-medium">{isKz ? 'Жеткізу: 1-2 күн' : 'Доставка: 1-2 дня'}</div>
                  <div className="text-[11px] text-zinc-500">{isKz ? 'Алматы, Астана және ҚР барлық қалалары' : 'По всему Казахстану'}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-zinc-800 dark:text-zinc-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-zinc-900 dark:text-zinc-200 font-medium">{isKz ? '100% Түпнұсқа басылым' : '100% Оригинальное издание'}</div>
                  <div className="text-[11px] text-zinc-500">{isKz ? 'Ресми баспа кепілдігі және қайтару құқығы' : 'Гарантия возврата и чеки'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Quote / Excerpt if present */}
          {book.quote && (
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900/60 border-l-2 border-zinc-900 dark:border-zinc-400 rounded-r text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                <Quote className="w-3 h-3" />
                <span>{isKz ? 'Кітаптан үзінді' : 'Цитата из книги'}</span>
              </div>
              <p className="italic leading-relaxed font-serif text-zinc-900 dark:text-zinc-200">
                «{book.quote}»
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              {t('product.description') || 'Сипаттама'}
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
              {book.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              {t('product.characteristics') || 'Сипаттамалары'}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs border-t border-zinc-200 dark:border-zinc-800 pt-3">
              <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <dt className="text-zinc-500">{isKz ? 'Авторы' : 'Автор'}</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-200">{book.author}</dd>
              </div>
              {book.publisher && (
                <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                  <dt className="text-zinc-500">{isKz ? 'Баспасы' : 'Издательство'}</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-200">{book.publisher}</dd>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <dt className="text-zinc-500">{isKz ? 'Жанры' : 'Жанр'}</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-200">{genreName}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <dt className="text-zinc-500">{isKz ? 'Басылған жылы' : 'Год издания'}</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-200 font-mono">{book.publicationYear}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <dt className="text-zinc-500">{isKz ? 'Беттер саны' : 'Количество страниц'}</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-200 font-mono">{book.pages}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <dt className="text-zinc-500">{isKz ? 'Тілі' : 'Язык'}</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-200">
                  {book.language === 'kz' ? 'Қазақша' : book.language === 'en' ? 'English' : 'Русский'}
                </dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                <dt className="text-zinc-500">ISBN</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-200 font-mono">{book.isbn}</dd>
              </div>
              {book.weight && (
                <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                  <dt className="text-zinc-500">{isKz ? 'Салмағы' : 'Вес'}</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-200 font-mono">{book.weight}</dd>
                </div>
              )}
              {book.dimensions && (
                <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-900">
                  <dt className="text-zinc-500">{isKz ? 'Өлшемі' : 'Формат'}</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-200 font-mono">{book.dimensions}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section id="reviews" className="space-y-6 pt-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">
              {isKz ? 'Оқырмандар пікірлері' : 'Отзывы читателей'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {isKz ? `Тексерілген сатып алушылардың бағалауы (${book.reviewsCount} пікір)` : `Оценки проверенных покупателей (${book.reviewsCount} отзывов)`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-zinc-900 dark:text-zinc-100 font-mono text-xl font-bold">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500 dark:fill-zinc-200 dark:text-zinc-200" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-zinc-400 font-mono">/ 5.0</span>
          </div>
        </div>

        {/* Rating Breakdown Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded shadow-xs">
          <div className="space-y-2">
            {[
              { stars: 5, pct: 85 },
              { stars: 4, pct: 10 },
              { stars: 3, pct: 3 },
              { stars: 2, pct: 1 },
              { stars: 1, pct: 1 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-3 text-xs">
                <span className="font-mono text-zinc-600 dark:text-zinc-400 w-6">{row.stars} ★</span>
                <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <div className="h-full bg-zinc-900 dark:bg-zinc-300 rounded-full" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="font-mono text-zinc-500 w-10 text-right">{row.pct}%</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center space-y-3 sm:border-l sm:border-zinc-200 dark:sm:border-zinc-900 sm:pl-6 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-200">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="font-medium">{isKz ? '98% оқырман бұл кітапты ұсынады' : '98% читателей рекомендуют эту книгу'}</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-light">
              {isKz ? 'Барлық пікірлер сайт арқылы тапсырыс берген шынайы сатып алушылар тарапынан жазылған.' : 'Все отзывы оставлены реальными покупателями маркетплейса.'}
            </p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {MOCK_REVIEWS.default.map((rev) => (
            <div key={rev.id} className="p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded space-y-2 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">{rev.author}</span>
                  <span className="text-[11px] text-zinc-500">({rev.city})</span>
                  {rev.isVerified && (
                    <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800/60 dark:text-emerald-400 text-[10px] font-mono rounded">
                      {isKz ? 'Сатып алған' : 'Купил товар'}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-zinc-500">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < rev.rating ? 'fill-amber-500 text-amber-500 dark:fill-zinc-200 dark:text-zinc-200' : 'text-zinc-300 dark:text-zinc-800'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-light">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedBooks.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">
            {isKz ? 'Осы санаттағы өзге таңдаулы кітаптар' : 'Похожие издания в этой категории'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <ProductCard key={relBook.id} product={relBook} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
