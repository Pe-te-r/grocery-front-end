
export interface CategoryItem {
  name: string;
  images: string[]; 
}

export interface LoginDataType{
  email: string;
  password: string;
}

export enum UserRole{
  CUSTOMER='customer'
}
export interface RegisterDataType{
  fist_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

export interface UserData{
  tokens: {
    accessToken: string;
    refreshToken: string;
  },
  user: {
    id: string;
    email: string;
    role:UserRole
  }
}

export interface LoginResponseType{
  status: 'success' | 'error'
  message: string;
  data: UserData;
}

export interface authStoreType{
  isVerified: boolean;
  user: UserData;
}

export interface RegisterDataTypeT{
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

export interface RegisterResponseType{
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