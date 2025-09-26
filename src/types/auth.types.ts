export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  userType: 'admin' | 'user';
  token: string;
  user?: {
    id: string;
    email: string;
    nombre: string;
    votosRealizados?: number;
    activo?:boolean;
  };
  admin?: {
    id: string;
    email: string;
    nombre: string;
  };
}