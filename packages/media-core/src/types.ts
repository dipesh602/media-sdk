export type MediaType = "photo" | "video";

export interface MediaItem {
  id: number;
  type: MediaType;

  width: number;
  height: number;

  url: string;

  title?: string;
  description?: string;

  thumbnailUrl?: string;
  previewUrl?: string;

  photographer?: string;
  photographerUrl?: string;

  duration?: number;
}

export interface Pagination {
  page: number;
  perPage: number;
  totalResults: number;
  hasNextPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}