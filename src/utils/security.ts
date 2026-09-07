// src/utils/security.ts

const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

/**
 * Validates and sanitizes image and resource URLs.
 * Blocks dangerous protocols such as javascript:, vbscript:, and malicious data URIs.
 */
export function sanitizeUrl(url: unknown, fallback: string = FALLBACK_IMAGE_URL): string {
  if (typeof url !== 'string' || !url.trim()) {
    return fallback;
  }

  const cleanUrl = url.trim();

  // Block dangerous pseudo-protocols
  const dangerousPattern = /^(javascript|vbscript|data(?!\s*:\s*image\/(png|jpeg|jpg|webp|gif|svg\+xml))):/i;
  if (dangerousPattern.test(cleanUrl)) {
    return fallback;
  }

  // Allow relative paths, http, https, and safe data-images
  try {
    if (cleanUrl.startsWith('/') || cleanUrl.startsWith('./') || cleanUrl.startsWith('../')) {
      return cleanUrl;
    }
    const parsed = new URL(cleanUrl);
    if (['http:', 'https:'].includes(parsed.protocol)) {
      return cleanUrl;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

/**
 * Validates and sanitizes monetary values (prices).
 * Prevents negative values, NaN, Infinity, and overflows.
 */
export function sanitizePrice(price: unknown, defaultVal: number = 0): number {
  if (typeof price === 'number') {
    if (!Number.isFinite(price) || Number.isNaN(price) || price < 0) {
      return defaultVal;
    }
    return Math.round(price * 100) / 100;
  }

  if (typeof price === 'string') {
    const parsed = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    if (!Number.isFinite(parsed) || Number.isNaN(parsed) || parsed < 0) {
      return defaultVal;
    }
    return Math.round(parsed * 100) / 100;
  }

  return defaultVal;
}

/**
 * Validates and sanitizes inventory stock counts.
 * Ensures an integer within [0, maxLimit].
 */
export function sanitizeStock(stock: unknown, defaultVal: number = 0, maxLimit: number = 100000): number {
  let val: number;

  if (typeof stock === 'number') {
    val = stock;
  } else if (typeof stock === 'string') {
    val = parseInt(stock.replace(/[^0-9-]+/g, ''), 10);
  } else {
    return defaultVal;
  }

  if (!Number.isFinite(val) || Number.isNaN(val)) {
    return defaultVal;
  }

  return Math.max(0, Math.min(Math.floor(val), maxLimit));
}

/**
 * Sanitizes user text inputs against XSS and HTML injections.
 * Strips script tags and raw HTML markup while preserving text content.
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return '';
    return String(input);
  }

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Sanitizes order and cart item quantities.
 * Ensures an integer within [1, maxLimit].
 */
export function sanitizeQuantity(quantity: unknown, maxLimit: number = 999): number {
  const parsed = typeof quantity === 'number' ? quantity : parseInt(String(quantity), 10);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed) || parsed <= 0) {
    return 1;
  }
  return Math.max(1, Math.min(Math.floor(parsed), maxLimit));
}

/**
 * Sanitizes entity IDs to alphanumeric, dashes, and underscores.
 */
export function sanitizeId(id: unknown): string {
  if (typeof id !== 'string') {
    if (typeof id === 'number') return String(id);
    return '';
  }
  return id.replace(/[^a-zA-Z0-9_-]/g, '').trim();
}
