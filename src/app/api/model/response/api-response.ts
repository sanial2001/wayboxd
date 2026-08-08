export interface ApiResponse<T> {
  data?: T;
  error?: string;
  errorCode?: string;
  status: number;
}
