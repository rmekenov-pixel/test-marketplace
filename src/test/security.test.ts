// src/test/security.test.ts
import { describe, it, expect } from 'vitest';
import {
  sanitizeUrl,
  sanitizePrice,
  sanitizeStock,
  sanitizeInput,
  sanitizeQuantity,
  sanitizeId,
} from '../utils/security';

describe('Security & Sanitization Utils', () => {
  describe('sanitizeUrl', () => {
    it('blocks javascript: payload exploits', () => {
      const dangerous = 'javascript:alert("XSS")';
      expect(sanitizeUrl(dangerous)).not.toContain('javascript:');
    });

    it('blocks vbscript: exploits', () => {
      const dangerous = 'vbscript:msgbox(1)';
      expect(sanitizeUrl(dangerous)).not.toContain('vbscript:');
    });

    it('allows valid HTTPS image urls', () => {
      const valid = 'https://images.unsplash.com/photo-12345?w=600';
      expect(sanitizeUrl(valid)).toBe(valid);
    });

    it('returns fallback on invalid or empty url', () => {
      expect(sanitizeUrl('')).toBeDefined();
      expect(sanitizeUrl(null)).toBeDefined();
    });
  });

  describe('sanitizePrice', () => {
    it('prevents negative prices', () => {
      expect(sanitizePrice(-5000)).toBe(0);
    });

    it('prevents NaN and Infinity', () => {
      expect(sanitizePrice(NaN)).toBe(0);
      expect(sanitizePrice(Infinity)).toBe(0);
    });

    it('sanitizes string numbers correctly', () => {
      expect(sanitizePrice('12500 ₸')).toBe(12500);
      expect(sanitizePrice('4500.50')).toBe(4500.50);
    });
  });

  describe('sanitizeStock', () => {
    it('ensures non-negative integer within limit', () => {
      expect(sanitizeStock(-10)).toBe(0);
      expect(sanitizeStock(25.8)).toBe(25);
      expect(sanitizeStock(99999999)).toBe(100000);
    });
  });

  describe('sanitizeInput', () => {
    it('strips script tags and harmful HTML', () => {
      const malicious = '<script>alert("hack")</script><b>Қазақстан</b>';
      expect(sanitizeInput(malicious)).toBe('Қазақстан');
    });

    it('trims whitespace', () => {
      expect(sanitizeInput('   Абай жолы   ')).toBe('Абай жолы');
    });
  });

  describe('sanitizeQuantity', () => {
    it('guarantees positive integer within limits', () => {
      expect(sanitizeQuantity(0)).toBe(1);
      expect(sanitizeQuantity(-5)).toBe(1);
      expect(sanitizeQuantity(5, 10)).toBe(5);
      expect(sanitizeQuantity(20, 10)).toBe(10);
    });
  });

  describe('sanitizeId', () => {
    it('removes unsafe characters from IDs', () => {
      expect(sanitizeId('book-123_abc')).toBe('book-123_abc');
      expect(sanitizeId('book<script>?id=1')).toBe('bookscriptid1');
    });
  });
});
