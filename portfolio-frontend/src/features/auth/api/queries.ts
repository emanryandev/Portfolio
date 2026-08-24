import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api/client';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

export const useUser = () => {
  return useQuery<User, ApiError>({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await apiClient.get('/api/user');
      return response.data;
    },
    retry: false, // Don't retry if 401
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
