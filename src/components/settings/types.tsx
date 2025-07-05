export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  joinedAt: string;
  lastLogin: string;
  isTwoFactorEnabled: boolean;
  status?: string;
  role?: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}