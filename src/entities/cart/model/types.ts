import type { Book } from '../../book';

/**
 * Normalized Cart Item.
 * Stores only reference ID and quantity to avoid stale data duplication.
 */
export interface CartItem {
  bookId: string;
  quantity: number;
}

/**
 * Populated Cart Item with live Book entity reference.
 */
export interface PopulatedCartItem {
  bookId: string;
  quantity: number;
  book: Book;
  subtotal: number;
}
