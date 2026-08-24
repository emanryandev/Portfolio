export interface ServiceFeature {
  feature_name: string;
  order: number;
}

export interface ServicePackage {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_type: 'fixed' | 'starting_at' | 'custom';
  price: number | null;
  is_featured: boolean;
  order: number;
  features?: ServiceFeature[];
}
