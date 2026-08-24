import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api/client';
import { authKeys, User } from './queries';

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, LoginCredentials>({
    mutationFn: async (credentials) => {
      // 1. Fetch CSRF cookie
      await apiClient.get('/sanctum/csrf-cookie');
      
      // 2. Perform Login
      await apiClient.post('/api/login', credentials);
      
      // 3. Fetch User profile
      const response = await apiClient.get('/api/user');
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user(), user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError>({
    mutationFn: async () => {
      await apiClient.post('/api/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};
