
export interface CategoryItem {
  name: string;
  images: string[];
}

export interface LoginDataType {
  email: string;
  password: string;
}

export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  SUPERADMIN = 'superadmin',
  // ADMIN = 'admin',
  DRIVER = 'driver'
}
export interface RegisterDataType {
  fist_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

export interface UserData {
  tokens: {
    accessToken: string;
    refreshToken: string;
  },
  user: {
    id: string;
    email: string;
    role: UserRole
  }
}

export interface LoginResponseType {
  status: 'success' | 'error'
  message: string;
  data: UserData;
}

export interface authStoreType {
  isVerified: boolean;
  user: UserData;
}

export interface RegisterDataTypeT {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

export interface RegisterResponseType {
  status: 'error' | 'success';
  message: string;
  data: null;

}

export interface allUserQuery {
  customers?: boolean
  admin?: boolean
  vendor?: boolean
  superadmin?: boolean
  driver?: boolean
}

// types/users.ts
export enum AccountStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  DELETED = 'deleted',
  LOCKED = 'locked',
  INACTIVE = 'inactive',
}

export type User = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  is_verified: boolean
  account_status: AccountStatus
  created_at: string
  role?: string
}

export type UserRoleEnum = 'customers' | 'admins' | 'vendors' | 'drivers'


// types/category.ts
export type ApiResponse<T> = {
  status: 'error' | 'success';
  message: string;
  data: T;
};

export type Category = {
  id: string;
  name: string;
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
};


// types.ts
export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export interface UserAuthType {
  id: string;
  email: string;
  role: UserRole;
}

export type AuthState = {
  tokens: Tokens | null;
  user: UserAuthType | null;
  isAuthenticated: boolean;
};

export type AuthActions = {
  login: (tokens: Tokens, userData: UserAuthType) => void;
  logout: () => void;
  updateAccessToken: (newAccessToken: string) => void;
  updateUser: (updatedUser: Partial<UserAuthType>) => void;
  verifyUser: () => void;
  reinitialize: () => void;
};

export type AuthStoreType = AuthState & AuthActions;


export interface updateSettingProfileType {
  id: string
  phone?: string;
  first_name?: string;
  last_name?: string;
}

export interface SubcategoryT{
  names:string
}
export interface createSubcategory{
  categoryId: string;
  names:string[]
}
export type ProductForm = {
  createdBy: string;
  name: string;
  price: string;
  stock: string;
  description: string;
  isAvailable: boolean;
  category: string;
  subCategory: string;
  image: File | null | string;
};


// types.ts
export interface CartItem {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  quantity: number;
  stock: number;
  store_id: string;
}

export interface CartState {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export enum CodeReason {
  REGISTRATION = 'registration',
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION = 'email_verification',
  TWO_FACTOR_AUTH = 'two_factor_auth',
  ACCOUNT_RECOVERY = 'account_recovery',
  SECURITY_ALERT = 'security_alert'
}