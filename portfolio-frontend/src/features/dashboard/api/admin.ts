import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api/client';
import { AdminProject } from '@/features/projects/api/admin';
import { AdminContactRequest } from '@/features/contact/api/admin';

export interface DashboardMetrics {
  projects: number;
  team_members: number;
  services: number;
  new_contact_requests: number;
}

export interface DashboardSummary {
  metrics: DashboardMetrics;
  recent_projects: AdminProject[];
  recent_contact_requests: AdminContactRequest[];
}

export const dashboardKeys = {
  all: ['admin', 'dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
};

export const useDashboardSummary = () => {
  return useQuery<{ data: DashboardSummary }, ApiError>({
    queryKey: dashboardKeys.summary(),
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/dashboard/summary');
      return response.data;
    },
  });
};
