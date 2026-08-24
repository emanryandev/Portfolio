import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ApiCollectionResponse, ApiSingleResponse } from '@/types/api';
import { TeamMember } from '../types';

export const useTeam = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiCollectionResponse<TeamMember>>('/api/team');
      return data;
    },
  });
};

export const useTeamMember = (slug: string) => {
  return useQuery({
    queryKey: ['team', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSingleResponse<TeamMember>>(`/api/team/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};
