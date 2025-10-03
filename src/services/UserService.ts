import { IUser } from "../models/User";
import { UserDao } from "../dao/UserDao";
import { CreateUserRequest, LoginRequest, LoginResponse, ResetPasswordRequest, TokenVerificationResponse, UpdatePasswordRequest, UpdateUserRequest, UserResponse, UserValidation } from "../types/user.types";
import { generateToken, JWTPayload } from "../config/jwt";
import { EmailService } from "./EmailService";
import crypto from 'crypto';

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
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      nombre: user.nombre
    });

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

  //obtener todos los usuarios(admin)
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userDao.findAllUsers();
    return users.map(user => this.formatUserResponse(user));
  }

  //obtener todos los usuarios activos (admin)
  async getActiveUsers(): Promise<UserResponse[]> {
    const users = await this.userDao.findActiveUsers();
    return users.map(user => this.formatUserResponse(user));
  }

  //activar usuario (admin)
  async activateUser(id: string): Promise<UserResponse | null> {
    const user = await this.userDao.activateUser(id);
    return user ? this.formatUserResponse(user) : null;
  }

  //desactivar usuario (admin)
  async desactiveUser(id: string): Promise<UserResponse | null> {
    const user = await this.userDao.deactivateUser(id);
    return user ? this.formatUserResponse(user) : null;
  }

  // metodo para solicitar recuperacion de contraseña
  async requestPasswordReset(email: string): Promise<void> {
    // busco si el usuario existe
    const user = await this.userDao.findByEmail(email);
    if(!user) {
      throw new Error('Recibira un email para recuperar la contraseña');
    }
    if(!user.activo) {
      throw new Error('El usuario esta inactivo');
    }
    // genero token unico y aleatorio
    const resetToken = crypto.randomBytes(32).toString('hex');
    //calculo fecha de expiracion
    const tokenExpires = new Date(Date.now() + 3600000);
    // guardo el token en la base de datos
    await this.userDao.saveResetToken(user._id.toString(), resetToken, tokenExpires);

    // envio el email de recuperacion
    const emailService = new EmailService();
    await emailService.sendPasswordReset({
      email: user.email,
      resetToken: resetToken,
      userName: user.nombre
    });
  }

  // metodo para resetear la contraseña usando el token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // busco al user por el token valido
    const user = await this.userDao.findByResetToken(token);
    if (!user) {
      throw new Error('Token de recuperacion invalido o expirado');
    }
    if (newPassword.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
  
    // cambio la contraseña y vacio los campos de token y tokenExpires
    user.password = newPassword;
    user.token = '';
    user.tokenExpires = undefined;

    // guardo los cambios
    await user.save();
  }

  // Método para verificar si un token es válido (opcional, para el frontend)
  async verifyResetToken(token: string): Promise<TokenVerificationResponse> {
    const user = await this.userDao.findByResetToken(token);
    
    if (!user) {
      return {
        valid: false,
        message: 'Token inválido o expirado'
      };
    }

    return {
      valid: true,
      message: 'Token válido'
    };
    }

}