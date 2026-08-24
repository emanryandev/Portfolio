// Base API response types
export interface PaginatedMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface ApiCollectionResponse<T> {
  data: T[];
  links?: PaginatedLinks;
  meta?: PaginatedMeta;
}

export interface ApiSingleResponse<T> {
  data: T;
  message?: string;
}
