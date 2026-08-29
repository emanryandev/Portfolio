export interface ServiceFeature {
  feature_name: string;
  order: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_type: 'fixed' | 'starting_at' | 'custom';
  price: string | null;
  category?: 'global' | 'backend' | 'devops' | 'pentesting';
  is_featured: boolean;
  order: number;
  features?: string[];
}
