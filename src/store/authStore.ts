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




// src/store/authStore.ts
import type { authStoreType, UserData } from '@/util/types';
import { create } from 'zustand';

// type User = {
//   id: string;
//   email: string;
//   role: string;
//   isVerified: boolean;
// };

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthState = {
  tokens: Tokens | null;
  user: UserData | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  login: (tokens: Tokens, user: UserData) => void;
  logout: () => void;
  updateAccessToken: (newAccessToken: string) => void;
  updateUser: (updatedUser: Partial<UserData>) => void;
  verifyUser: () => void;
};

const initialState: AuthState = {
  tokens: null,
  user: null,
  isAuthenticated: false,
};

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  // Login and set both tokens and user data
  login: (tokens, user) =>
    set({
      tokens,
      user,
      isAuthenticated: true,
    }),

  // Clear all authentication data
  logout: () =>
    set({
      tokens: null,
      user: null,
      isAuthenticated: false,
    }),

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
      user: state.user ? { ...state.user, ...updatedUser } : null,
    })),

  // Mark user as verified
  verifyUser: () =>
    set((state) => ({
      user: state.user ? { ...state.user, isVerified: true } : null,
    })),
}));

export default useAuthStore;