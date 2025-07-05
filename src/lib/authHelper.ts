import useAuthStore, { type Tokens } from '@/store/authStore';
import type { authStoreType, UserData } from '@/util/types';

// === READ HELPERS ===

export const getAuthUser = (): UserDatag | undefined  => useAuthStore().user?.user;

export const getAuthTokens = (): Tokens | null => useAuthStore.getState().tokens;

export const getAccessToken = (): string | null =>
  useAuthStore.getState().tokens?.accessToken || null;

export const getRefreshToken = (): string | null =>
  useAuthStore.getState().tokens?.refreshToken || null;

export const getUserId = (): string | null => useAuthStore.getState().user?.user.user.id || null;

export const getUserEmail = (): string | null => useAuthStore.getState().user?.user.user.email || null;

export const getUserRole = (): string | null => useAuthStore.getState().user?.user.user.role || null;

export const isUserVerified = (): boolean => useAuthStore.getState().user?.isVerified ?? false;

export const isAuthenticated = (): boolean | undefined => useAuthStore.getState().user?.isVerified;

// === ACTION HELPERS ===

export const loginUser = (tokens: Tokens, user: UserData): void =>
  useAuthStore.getState().login(tokens, user);

export const logoutUser = (): void =>
  useAuthStore.getState().logout();

export const updateAccessToken = (accessToken: string): void =>
  useAuthStore.getState().updateAccessToken(accessToken);

export const updateUserData = (partialUser: Partial<authStoreType>): void =>
  useAuthStore.getState().updateUser(partialUser);

export const verifyCurrentUser = (): void =>
  useAuthStore.getState().verifyUser();
