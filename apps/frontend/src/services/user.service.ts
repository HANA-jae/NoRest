import { apiClient } from '@/lib/api-client';
import type { IUser, UpdateUserPayload } from '@han/shared';

interface ApiEnvelope<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export const userService = {
  async getProfile(): Promise<IUser> {
    const res = await apiClient.get<ApiEnvelope<IUser>>('/users/me');
    return res.data;
  },

  async updateProfile(payload: UpdateUserPayload): Promise<IUser> {
    const res = await apiClient.patch<ApiEnvelope<IUser>>('/users/me', payload);
    return res.data;
  },
};
