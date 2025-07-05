// import { UserRole, type authStoreType } from "@/util/types";
// import { Store } from "@tanstack/store";

// const intialDataStore: authStoreType = {
//   isVerified: false,
//   user: {
//     tokens: {
//       accessToken: '',
//       refreshToken:''
//     },
//     user: {
//       email: '',
//       id: '',
//       role:UserRole.CUSTOMER
//     }
//   }
// }

// export const authStore = new Store<authStoreType>(intialDataStore)


// export const authActions = {
//   setUser: (data:authStoreType) => {
//     authStore.setState(data)
//     localStorage.setItem('auth',JSON.stringify(data))
//   },
//   deleteUser: () => {
//     authStore.setState(intialDataStore)
//     localStorage.removeItem('auth')
//   },
//   intializeUser:async () => {
//     const userData = localStorage.getItem('auth')
//     if (userData) {
//       const userJson: authStoreType =await JSON.parse(userData)
//       console.log('data from localstorage',userJson)
//       authStore.setState(userJson)
//       console.log('store data',authStore.state)
//     }
//   }

// }




// authStore.ts
import type { AuthState, AuthStoreType } from '@/util/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORAGE_KEY = 'auth-storage';

const initialState: AuthState = {
  tokens: null,
  user: null,
  isAuthenticated: false,
};

const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      ...initialState,

      // Login and set both tokens and user data
      login: (tokens, userData) =>
        set({
          tokens,
          user: userData,
          isAuthenticated: true,
        }),

      // Clear all authentication data
      logout: () => {
        set(initialState);
        localStorage.removeItem(STORAGE_KEY); // Optional: explicitly remove from localStorage
      },

      // Update just the access token
      updateAccessToken: (newAccessToken) =>
        set((state) => ({
          tokens: state.tokens
            ? { ...state.tokens, accessToken: newAccessToken }
            : null,
        })),

      // Update partial user data
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user
            ? {
              ...state.user,
              user: { ...state.user, ...updatedUser },
            }
            : null,
        })),

      // Mark user as verified
      verifyUser: () =>
        set((state) => ({
          user: state.user
            ? {
              ...state.user,
              user: { ...state.user, isVerified: true },
            }
            : null,
        })),

      // Reinitialize from localStorage
      reinitialize: () => {
        const storedState = localStorage.getItem(STORAGE_KEY);
        if (storedState) {
          try {
            const parsedState = JSON.parse(storedState);
            if (parsedState.state) {
              set({ ...parsedState.state });
            }
          } catch (error) {
            console.error('Failed to parse stored auth state', error);
          }
        }
      },
    }),
    {
      name: STORAGE_KEY, // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // Optional: you can whitelist or blacklist specific fields
      // partialize: (state) => ({ tokens: state.tokens, user: state.user }),
    }
  )
);

export default useAuthStore;