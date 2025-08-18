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

  //Metodo para crear un usuario
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    //verifico que el email no este registrado
    const emailExist = await this.userDao.emailExists(userData.email);
    if(emailExist) {
      throw new Error('El email ya se encuentra registrado');
    }
    //creo el nuevo usuario
    const newUser = await this.userDao.createUser(userData);
    return this.formatUserResponse(newUser);
  }

  //Metodo para iniciar sesion(Login)
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    //verificar las credenciales
    const user = await this.userDao.verifyCredentials(credentials.email, credentials.password)
    if(!user) {
      throw new Error('Credenciales invalidas');
    }
    //verificio que el usuario este activo
    if(!user.activo) {
      throw new Error('El usuario esta inactivo');
    }
    //genero un token
    const token = this.generateToken(user._id.toString());

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        nombre: user.nombre,
        votosRealizados: user.votosRealizados,
        activo: user.activo
      }
    };
  }

}