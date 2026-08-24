export interface TeamMember {
  id: number;
  name: string;
  slug: string;
  role: string;
  bio: string;
  image_url: string | null;
  email: string | null;
  order: number;
  // Included in detailed response
  skills?: string[];
  social_links?: any[];
  project_contributions?: any[];
}
