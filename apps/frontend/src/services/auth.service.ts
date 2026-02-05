import { apiClient } from '@/lib/api-client';
import type { LoginPayload, RegisterPayload, IUser } from '@han/shared';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

interface ApiEnvelope<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<ApiEnvelope<AuthResponse>>('/auth/login', payload, {
      skipAuth: true,
    });
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient.post<ApiEnvelope<AuthResponse>>('/auth/register', payload, {
      skipAuth: true,
    });
    return res.data;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const res = await apiClient.post<ApiEnvelope<AuthResponse>>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true },
    );
    return res.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/auth/logout', { refreshToken });
  },
};
