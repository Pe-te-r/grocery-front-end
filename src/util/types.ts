
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