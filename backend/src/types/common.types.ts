//tipos para respuesta estandar de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Tipos de respuesta exitosa
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}