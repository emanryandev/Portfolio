import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api/client';

export interface AdminTeamMember {
  id: number;
  name: string;
  slug: string;
  role: string;
  email: string;
  bio: string | null;
  image_url: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export const adminTeamKeys = {
  all: ['admin', 'team'] as const,
  lists: () => [...adminTeamKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...adminTeamKeys.lists(), filters] as const,
  details: () => [...adminTeamKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminTeamKeys.details(), id] as const,
};

export const useAdminTeamMembers = (filters: Record<string, any> = {}) => {
  return useQuery<{ data: AdminTeamMember[], meta?: any }, ApiError>({
    queryKey: adminTeamKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/team-members', { params: filters });
      return response.data;
    },
  });
};

export const useAdminTeamMember = (id: number) => {
  return useQuery<{ data: AdminTeamMember }, ApiError>({
    queryKey: adminTeamKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/api/admin/team-members/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminTeamMember }, ApiError, Partial<AdminTeamMember>>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/api/admin/team-members', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
    },
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminTeamMember }, ApiError, { id: number, data: Partial<AdminTeamMember> }>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/api/admin/team-members/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.detail(id) });
    },
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/admin/team-members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminTeamKeys.lists() });
    },
  });
};
