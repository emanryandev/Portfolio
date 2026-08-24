import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api/client';

export interface AdminContactRequest {
  id: number;
  client_name: string;
  client_email: string;
  company_name: string | null;
  project_type: string;
  budget_range: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  recipients?: Array<{
    team_member_id: number;
    team_member?: { name: string };
  }>;
}

export const adminContactKeys = {
  all: ['admin', 'contacts'] as const,
  lists: () => [...adminContactKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...adminContactKeys.lists(), filters] as const,
  details: () => [...adminContactKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminContactKeys.details(), id] as const,
};

export const useAdminContactRequests = (filters: Record<string, any> = {}) => {
  return useQuery<{ data: AdminContactRequest[], meta?: any }, ApiError>({
    queryKey: adminContactKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/contact-requests', { params: filters });
      return response.data;
    },
  });
};

export const useAdminContactRequest = (id: number) => {
  return useQuery<{ data: AdminContactRequest }, ApiError>({
    queryKey: adminContactKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/api/admin/contact-requests/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Optimistic Update for status toggle
export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ data: AdminContactRequest }, ApiError, { id: number, status: string }>({
    mutationFn: async ({ id, status }) => {
      const response = await apiClient.put(`/api/admin/contact-requests/${id}`, { status });
      return response.data;
    },
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: adminContactKeys.lists() });
      await queryClient.cancelQueries({ queryKey: adminContactKeys.detail(id) });

      // Snapshot the previous value
      const previousLists = queryClient.getQueriesData({ queryKey: adminContactKeys.lists() });
      
      // Optimistically update lists
      queryClient.setQueriesData({ queryKey: adminContactKeys.lists() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((contact: AdminContactRequest) => 
            contact.id === id ? { ...contact, status } : contact
          )
        };
      });

      // Optimistically update detail
      queryClient.setQueryData(adminContactKeys.detail(id), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, status }
        };
      });

      return { previousLists };
    },
    onError: (_err, variables, context: any) => {
      // Rollback
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: adminContactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminContactKeys.detail(variables.id) });
    },
  });
};

export const useDeleteContactRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/api/admin/contact-requests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminContactKeys.lists() });
    },
  });
};
