import { apiClient } from '@/lib/api-client';

interface DailyPhrase {
  text: string;
  category: string;
}

interface ApiEnvelope<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export const phraseService = {
  async getDailyPhrase(): Promise<DailyPhrase | null> {
    try {
      const res = await apiClient.get<ApiEnvelope<DailyPhrase>>('/phrases/daily');
      return res.data;
    } catch {
      return null;
    }
  },
};
