import type { Book, CreateBookDto, UpdateBookDto, BookFilterParams } from '../model/types';
import { storageService } from '../../../shared/api/storage';
import { mockNetworkDelay } from '../../../shared/api/baseApi';
import { sanitizeInput, sanitizePrice, sanitizeStock, sanitizeUrl, sanitizeId } from '../../../shared/lib/security';

const STORAGE_KEY = 'kitap_all_books_v2';

const INITIAL_BOOKS_SEED: Book[] = [
  {
    id: 'book-1',
    title: 'Абай жолы (4 томдық)',
    author: 'Мұхтар Әуезов',
    price: 12500,
    oldPrice: 15000,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: 'Қазақтың бас ақыны Абай Құнанбайұлының өмірі мен қазақ қоғамының тұрмыс-тіршілігін суреттейтін ұлы эпопея.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 24,
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    publicationYear: 2021,
    pages: 1420,
    isbn: '978-601-04-1234-5',
  },
  {
    id: 'book-2',
    title: 'Қан мен тер (Трилогия)',
    author: 'Әбдіжәмил Нұрпейісов',
    price: 8900,
    oldPrice: 10500,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    description: 'Арал балықшыларының ауыр тұрмысы мен әлеуметтік қайшылықтарды терең бейнелейтін тарихи роман.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 18,
    rating: 4.8,
    reviewsCount: 64,
    isFeatured: true,
    publicationYear: 2019,
    pages: 890,
    isbn: '978-601-04-5678-9',
  },
  {
    id: 'book-3',
    title: 'Көшпенділер (Трилогия)',
    author: 'Ілияс Есенберлин',
    price: 9800,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b29?w=600&auto=format&fit=crop&q=80',
    description: 'XV–XIX ғасырлардағы Қазақ хандығының қалыптасуы мен азаттық күресін баяндайтын монументалды шығарма.',
    genre: 'history',
    language: 'kz',
    stock: 32,
    rating: 5.0,
    reviewsCount: 210,
    isFeatured: true,
    publicationYear: 2022,
    pages: 1120,
    isbn: '978-601-04-9012-3',
  },
  {
    id: 'book-4',
    title: 'Атомные привычки',
    author: 'Джеймс Клир',
    price: 4500,
    oldPrice: 5500,
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
    description: 'Как незначительные изменения приводят к выдающимся результатам в бизнесе, учебе и повседневной жизни.',
    genre: 'psychology',
    language: 'ru',
    stock: 45,
    rating: 4.9,
    reviewsCount: 350,
    isFeatured: true,
    publicationYear: 2023,
    pages: 320,
    isbn: '978-5-04-100234-1',
  },
  {
    id: 'book-5',
    title: 'Думай и богатей',
    author: 'Наполеон Хилл',
    price: 3900,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    description: 'Классическое руководство по достижению финансового успеха и развитию предпринимательского мышления.',
    genre: 'business',
    language: 'ru',
    stock: 12,
    rating: 4.7,
    reviewsCount: 89,
    isFeatured: false,
    publicationYear: 2020,
    pages: 280,
    isbn: '978-5-17-098765-4',
  },
  {
    id: 'book-6',
    title: 'Қара сөздер',
    author: 'Абай Құнанбайұлы',
    price: 3200,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    description: 'Ұлы ойшылдың адамгершілік, ғылым-білім, тәрбие мен қоғам өмірі туралы философиялық толғаулары.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 50,
    rating: 5.0,
    reviewsCount: 420,
    isFeatured: true,
    publicationYear: 2023,
    pages: 160,
    isbn: '978-601-04-3344-1',
  },
  {
    id: 'book-7',
    title: 'Богатый папа, бедный папа',
    author: 'Роберт Кийосаки',
    price: 4200,
    oldPrice: 4900,
    coverImage: 'https://images.unsplash.com/photo-1554415707-9e49017aed81?w=600&auto=format&fit=crop&q=80',
    description: 'Финансовая грамотность, инвестиции и создание активов простыми словами для каждого.',
    genre: 'business',
    language: 'ru',
    stock: 8,
    rating: 4.8,
    reviewsCount: 195,
    isFeatured: false,
    publicationYear: 2021,
    pages: 352,
    isbn: '978-5- pop-01123-0',
  },
  {
    id: 'book-8',
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    price: 2800,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    description: 'Философская сказка-притча о дружбе, любви, верности и ответственности за тех, кого приручили.',
    genre: 'children',
    language: 'ru',
    stock: 19,
    rating: 4.9,
    reviewsCount: 140,
    isFeatured: false,
    publicationYear: 2022,
    pages: 128,
    isbn: '978-5-389-07435-4',
  },
  {
    id: 'book-9',
    title: 'Бақытты балалық шақ',
    author: 'Бердібек Соқпақбаев',
    price: 3600,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    description: 'Қазақ балалар әдебиетінің жауһары «Менің атым Қожа» және өзге де таңдаулы повестер топтамасы.',
    genre: 'children',
    language: 'kz',
    stock: 22,
    rating: 4.9,
    reviewsCount: 88,
    isFeatured: false,
    publicationYear: 2020,
    pages: 240,
    isbn: '978-601-04-7788-9',
  },
  {
    id: 'book-10',
    title: 'Қазақстан тарихы (Көне заманнан бүгінге дейін)',
    author: 'Академиктер тобы',
    price: 7500,
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    description: 'Қазақ мемлекеттілігінің қалыптасу кезеңдері, Ұлы Жібек жолы мен Тәуелсіздік дәуірінің кешенді тарихы.',
    genre: 'history',
    language: 'kz',
    stock: 14,
    rating: 4.6,
    reviewsCount: 45,
    isFeatured: false,
    publicationYear: 2021,
    pages: 640,
    isbn: '978-601-04-9900-1',
  },
  {
    id: 'book-11',
    title: 'К себе нежно',
    author: 'Ольга Примаченко',
    price: 4800,
    oldPrice: 5600,
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
    description: 'Книга-медитация о бережном отношении к своим чувствам, личным границам и внутреннему ресурсу.',
    genre: 'psychology',
    language: 'ru',
    stock: 0,
    rating: 4.8,
    reviewsCount: 230,
    isFeatured: true,
    publicationYear: 2023,
    pages: 336,
    isbn: '978-5-04-116524-4',
  },
  {
    id: 'book-12',
    title: 'От нуля к единице',
    author: 'Питер Тиль',
    price: 5200,
    coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&auto=format&fit=crop&q=80',
    description: 'Как создать стартап, который изменит будущее. Заметки о венчурном бизнесе от сооснователя PayPal.',
    genre: 'business',
    language: 'ru',
    stock: 11,
    rating: 4.7,
    reviewsCount: 95,
    isFeatured: false,
    publicationYear: 2022,
    pages: 208,
    isbn: '978-5-9614-4856-6',
  },
];

export const bookApi = {
  async getAll(): Promise<Book[]> {
    await mockNetworkDelay();
    return storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
  },

  async getById(id: string): Promise<Book | null> {
    await mockNetworkDelay();
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    return books.find((b) => b.id === id) || null;
  },

  async query(params: BookFilterParams): Promise<Book[]> {
    await mockNetworkDelay();
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    let result = [...books];

    if (params.genre && params.genre !== 'all') {
      result = result.filter((b) => b.genre === params.genre);
    }

    if (params.language && params.language !== 'all') {
      result = result.filter((b) => b.language === params.language);
    }

    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q)
      );
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => b.publicationYear - a.publicationYear);
          break;
        case 'popular':
        default:
          result.sort((a, b) => b.reviewsCount - a.reviewsCount);
          break;
      }
    }

    return result;
  },

  async create(dto: CreateBookDto): Promise<Book> {
    await mockNetworkDelay();
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: sanitizeInput(dto.title),
      author: sanitizeInput(dto.author),
      price: sanitizePrice(dto.price),
      oldPrice: dto.oldPrice !== undefined ? sanitizePrice(dto.oldPrice) : undefined,
      coverImage: sanitizeUrl(dto.coverImage),
      description: sanitizeInput(dto.description),
      genre: sanitizeInput(dto.genre),
      language: dto.language === 'ru' ? 'ru' : 'kz',
      stock: sanitizeStock(dto.stock),
      rating: Math.max(0, Math.min(5, Number(dto.rating) || 5.0)),
      reviewsCount: sanitizeStock(dto.reviewsCount, 0),
      isFeatured: Boolean(dto.isFeatured),
      publicationYear: sanitizeStock(dto.publicationYear, 2024, 2100),
      pages: sanitizeStock(dto.pages, 1),
      isbn: sanitizeInput(dto.isbn),
    };
    const updated = [newBook, ...books];
    storageService.set(STORAGE_KEY, updated);
    return newBook;
  },

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    await mockNetworkDelay();
    const cleanId = sanitizeId(id);
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    const index = books.findIndex((b) => b.id === cleanId);
    if (index === -1) throw new Error(`Book ${cleanId} not found`);

    const current = books[index];
    const updatedBook: Book = {
      ...current,
      ...(dto.title !== undefined && { title: sanitizeInput(dto.title) }),
      ...(dto.author !== undefined && { author: sanitizeInput(dto.author) }),
      ...(dto.price !== undefined && { price: sanitizePrice(dto.price) }),
      ...(dto.oldPrice !== undefined && { oldPrice: sanitizePrice(dto.oldPrice) }),
      ...(dto.coverImage !== undefined && { coverImage: sanitizeUrl(dto.coverImage) }),
      ...(dto.description !== undefined && { description: sanitizeInput(dto.description) }),
      ...(dto.genre !== undefined && { genre: sanitizeInput(dto.genre) }),
      ...(dto.language !== undefined && { language: dto.language === 'ru' ? 'ru' : 'kz' }),
      ...(dto.stock !== undefined && { stock: sanitizeStock(dto.stock) }),
      ...(dto.rating !== undefined && { rating: Math.max(0, Math.min(5, Number(dto.rating) || 5.0)) }),
      ...(dto.reviewsCount !== undefined && { reviewsCount: sanitizeStock(dto.reviewsCount, 0) }),
      ...(dto.isFeatured !== undefined && { isFeatured: Boolean(dto.isFeatured) }),
      ...(dto.publicationYear !== undefined && { publicationYear: sanitizeStock(dto.publicationYear, 2024, 2100) }),
      ...(dto.pages !== undefined && { pages: sanitizeStock(dto.pages, 1) }),
      ...(dto.isbn !== undefined && { isbn: sanitizeInput(dto.isbn) }),
    };
    books[index] = updatedBook;
    storageService.set(STORAGE_KEY, books);
    return updatedBook;
  },

  async delete(id: string): Promise<void> {
    await mockNetworkDelay();
    const cleanId = sanitizeId(id);
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    const updated = books.filter((b) => b.id !== cleanId);
    storageService.set(STORAGE_KEY, updated);
  },

  async updateStock(id: string, newStock: number): Promise<void> {
    await mockNetworkDelay();
    const cleanId = sanitizeId(id);
    const cleanStock = sanitizeStock(newStock);
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    const updated = books.map((b) =>
      b.id === cleanId ? { ...b, stock: cleanStock } : b
    );
    storageService.set(STORAGE_KEY, updated);
  },

  async decreaseStock(id: string, count: number): Promise<void> {
    await mockNetworkDelay();
    const cleanId = sanitizeId(id);
    const cleanCount = sanitizeStock(count, 1);
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    const updated = books.map((b) =>
      b.id === cleanId ? { ...b, stock: Math.max(0, b.stock - cleanCount) } : b
    );
    storageService.set(STORAGE_KEY, updated);
  },

  async reset(): Promise<Book[]> {
    await mockNetworkDelay();
    storageService.set(STORAGE_KEY, INITIAL_BOOKS_SEED);
    return INITIAL_BOOKS_SEED;
  },
};
