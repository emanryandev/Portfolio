import { TeamMember } from '@/features/team/types';

export interface Technology {
  id: number;
  name: string;
  slug: string;
}

export interface ProjectContribution {
  id: number;
  project_id: number;
  team_member_id: number;
  role: string;
  contribution_description: string;
  team_member?: TeamMember;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed';
  category_id: number | null;
  live_url: string | null;
  github_url: string | null;
  cover_image: string | null;
  is_featured: boolean;
  published_at: string | null;
  order: number;
  
  // Relations
  technologies?: Technology[];
  team_contributions?: ProjectContribution[];
  images?: any[];
}
