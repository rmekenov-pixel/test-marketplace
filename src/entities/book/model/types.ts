export type BookLanguage = 'kz' | 'ru';

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

export interface BookFilterParams {
  genre?: string;
  language?: BookLanguage | 'all';
  searchQuery?: string;
  sortBy?: 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'newest';
}

export type CreateBookDto = Omit<Book, 'id'>;
export type UpdateBookDto = Partial<CreateBookDto>;
