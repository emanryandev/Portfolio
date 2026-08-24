import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api/client';
import { ProjectFormValues } from '../schemas/projectSchema';

export interface AdminProject {
  id: number;
  title: string;
  slug: string;
  client_name: string | null;
  summary: string;
  description: string;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  technologies: string[];
  is_featured: boolean;
  published_at: string | null;
  order: number;
  created_at: string;
  updated_at: string;
  team_contributions?: Array<{
    id: number;
    team_member_id: number;
    role: string;
    contribution_description: string | null;
    order: number;
    team_member?: {
      name: string;
      image_url: string | null;
    };
  }>;
}

export const adminProjectKeys = {
  all: ['admin', 'projects'] as const,
  lists: () => [...adminProjectKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...adminProjectKeys.lists(), filters] as const,
  details: () => [...adminProjectKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminProjectKeys.details(), id] as const,
};

export const useAdminProjects = (filters: Record<string, any> = {}) => {
  return useQuery<{ data: AdminProject[], meta?: any }, ApiError>({
    queryKey: adminProjectKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/projects', { params: filters });
      return response.data;
    },
  });
};

export const useAdminProject = (id: number) => {
  return useQuery<{ data: AdminProject }, ApiError>({
    queryKey: adminProjectKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/api/admin/projects/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminProject }, ApiError, ProjectFormValues>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/api/admin/projects', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProjectKeys.lists() });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<{ data: AdminProject }, ApiError, { id: number, data: ProjectFormValues }>({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/api/admin/projects/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminProjectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminProjectKeys.detail(id) });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/admin/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProjectKeys.lists() });
    },
  });
};

export const useUploadMedia = () => {
  return useMutation<{ url: string }, ApiError, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
};
