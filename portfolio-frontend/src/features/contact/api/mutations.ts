import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ContactRequestPayload } from '../types';

export const useSubmitContactRequest = () => {
  return useMutation({
    mutationFn: async (payload: ContactRequestPayload) => {
      // CSRF token is handled by Axios interceptor / withCredentials
      const { data } = await apiClient.post('/api/contact', payload);
      return data;
    },
  });
};
