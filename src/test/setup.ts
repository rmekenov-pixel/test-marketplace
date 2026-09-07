// src/test/setup.ts
import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';

beforeEach(() => {
  localStorage.clear();
});
