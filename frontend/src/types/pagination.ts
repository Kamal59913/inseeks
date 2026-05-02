export interface PaginationMeta {
  limit: number;
  offset: number;
  nextOffset: number | null;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}
