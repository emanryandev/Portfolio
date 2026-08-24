import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiCollectionResponse, ApiSingleResponse } from '@/types/api';
import { Project } from '../types';

export const useProjects = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiCollectionResponse<Project>>('/api/projects', { params });
      return data;
    },
  });
};

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSingleResponse<Project>>(`/api/projects/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};
