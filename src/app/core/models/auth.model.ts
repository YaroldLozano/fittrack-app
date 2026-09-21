import { User } from './user.model';

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface LoginResponse extends ApiResponse {
  token?: string;
  expiresAt?: number;
  user?: User;
}

export interface ForgotPasswordResponse extends ApiResponse {}

export interface UpdateEmailResponse extends ApiResponse {
  user?: User;
}
