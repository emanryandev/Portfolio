export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  department?: 'backend' | 'devops' | 'pentesting' | 'none';
  bio: string;
  image_url: string | null;
  email: string | null;
  phone?: string | null;
  linkedin?: string | null;
  github?: string | null;
  order: number;
  // Included in detailed response
  skills?: string[];
  social_links?: any[];
  project_contributions?: any[];
}
