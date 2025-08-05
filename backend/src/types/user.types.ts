// tipos para crear un usuario
export interface CreateUserRequest {
  nombre: string;
  email: string;
  password: string;
}

// tipos para iniciar sesion
export interface LoginRequest {
  email: string;
  password: string;
}

// tipos para respuesta de inicio de sesion
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nombre: string;
    votosRealizados: number;
    activo: boolean;
  };
}

// tipo para modificar la contraseña
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}