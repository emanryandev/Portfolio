import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiCollectionResponse, ApiSingleResponse } from '@/types/api';
import { ServicePackage } from '../types';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiCollectionResponse<ServicePackage>>('/api/services');
      return data;
    },
  });
};
