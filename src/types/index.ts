export type Role = 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  balance: number;
  phone?: string;
  avatar?: string;
}

export type BookLanguage = 'kz' | 'ru' | 'en';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  oldPrice?: number;
  coverImage: string;
  description: string;
  genre: string;
  language: BookLanguage;
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  publicationYear: number;
  pages: number;
  isbn: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  deliveryAddress: string;
  paymentMethod: 'wallet' | 'kaspi_qr';
}

export interface Genre {
  id: string;
  name: string;
  nameKz: string;
  slug: string;
}

export interface FilterOptions {
  genre?: string;
  language?: BookLanguage | 'all';
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}
