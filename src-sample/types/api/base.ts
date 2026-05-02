export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  status?: number;
}

export interface ApiError {
  success: boolean;
  message: string;
  status?: number;
  error?: string | object;
}
