// Tipos para crear un administrador
export interface CreateAdminRequest {
  nombre: string;
  email: string;
  password: string;
}

//tipos para iniciar sesion (login)
export interface LoginRequest {
  email: string;
  password: string;
}

//tipos para respuesta de inicio de sesion
export interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    nombre: string;
  };
}

//tipo para cambiar la contraseña
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

//tipo para actualizar datos de un administrador
export interface UpdateAdminRequest {
  nombre?: string;
  email?: string;
}

//tipo para respuesta de administrador
export interface AdminResponse {
  id: string;
  email: string;
  nombre: string;
  ultimoAcceso?: Date;
  fechaCreacion: Date;
}

//tipo para  verificar token de admin
export interface AdminTokenValidation {
  isValid: boolean;
  admin?: {
    id:string;
    email: string;
    nombre: string;
  };
}