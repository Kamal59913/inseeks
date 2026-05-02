export interface BadResponse {
  success: boolean;                  // Always false for error
  message: string;                // Error message
  status?: number;                // Optional HTTP status code
  error?: string | object;        // Optional error detail — can be a string or object
}
