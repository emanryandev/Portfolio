import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api/client';

export interface AdminService {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_type: 'fixed' | 'starting_at' | 'custom';
  price: string | null;
  features: string[]; // JSON array in DB
  is_active: boolean;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export const adminServiceKeys = {
  all: ['admin', 'services'] as const,
  lists: () => [...adminServiceKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...adminServiceKeys.lists(), filters] as const,
  details: () => [...adminServiceKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminServiceKeys.details(), id] as const,
};

export const useAdminServices = (filters: Record<string, any> = {}) => {
  return useQuery<{ data: AdminService[], meta?: any }, ApiError>({
    queryKey: adminServiceKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/services', { params: filters });
      return response.data;
    },
  });
};

export const useAdminService = (id: number) => {
  return useQuery<{ data: AdminService }, ApiError>({
    queryKey: adminServiceKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/api/admin/services/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminService }, ApiError, Partial<AdminService>>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/api/admin/services', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.lists() });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminService }, ApiError, { id: number, data: Partial<AdminService> }>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/api/admin/services/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.detail(id) });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/admin/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminServiceKeys.lists() });
    },
  });
};
