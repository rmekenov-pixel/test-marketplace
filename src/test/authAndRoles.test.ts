// src/test/authAndRoles.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../entities/user/model/authStore';

describe('Auth & RBAC Store', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('starts unauthenticated after logout', () => {
    const { isAuthenticated, user, sessionToken } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(sessionToken).toBeNull();
  });

  it('logs in as CLIENT successfully and generates session token', () => {
    useAuthStore.getState().login('client', {
      name: 'Арыстан',
      email: 'arystan@test.kz',
    });

    const { isAuthenticated, user, role, sessionToken } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(role).toBe('client');
    expect(user?.name).toBe('Арыстан');
    expect(sessionToken).toBeDefined();
  });

  it('logs in as ADMIN and verifies session integrity', () => {
    useAuthStore.getState().login('admin');
    const { role, verifySession } = useAuthStore.getState();

    expect(role).toBe('admin');
    expect(verifySession()).toBe(true);
  });
});
