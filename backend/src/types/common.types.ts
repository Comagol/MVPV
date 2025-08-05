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

//Tipos para respuesta de error
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

//tipos para respuestas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

//tipos para validacion de campos
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

//tipos para respuestas de validacion
export interface ValidationResponse {
  isValid: boolean;
  errors?: ValidationError[];
}