import { IUser } from "../models/User";
import { UserDao } from "../dao/UserDao";
import { CreateUserRequest, LoginRequest, LoginResponse, UpdatePasswordRequest, UpdateUserRequest, UserResponse, UserValidation } from "../types/user.types";

export class UserService {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  private formatUserResponse(user: IUser): UserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      nombre: user.nombre,
      votosRealizados: user.votosRealizados,
      ultimoVoto: user.ultimoVoto,
      activo: user.activo
    };
  }

}