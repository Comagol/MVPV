import { User, IUser } from "../models/User";
import { CreateUserRequest, UpdateUserRequest, UserResponse } from "../types/user.types";
import bcrypt from 'bcryptjs';

export class UserDao {

  //crear un nuevo usuario
  async createUser(userData: CreateUserRequest): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  // Obtener un usuario por id
  async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  // Obtener un usuario por email
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase() });
  }

  //obtener todos los usuarios ordenador por nombre en orden alfabetico
  async findAllUsers(): Promise<IUser[]> {
    return await User.find().sort({ nombre: 1});
  }

  //obtener usuarios activos
  async findActiveUsers(): Promise<IUser[]> {
    return await User.find({ activo: true }).sort({ nombre: 1});
  }

  //Verificar si el email ya esta en uso
  async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({ email: email.toLowerCase() });
    return !!user;
  }

  //actualizar usuario
  async updateUser(id: string, updateData: UpdateUserRequest): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      {
        nombre: updateData.nombre,
        email: updateData.email,
      },
      { new: true }
    );
  }

  // incrementar votos de un usuario
  async incrementVotes(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      {
        $inc: { votosRealizados: 1},
        ultimoVoto: new Date()
      },
      { new: true }
    );
  }

  // verificar si el usuario puede votar
  async isActive(id: string): Promise<boolean> {
    const user = await User.findById(id);
    return user ? user.activo : false;
  }

 // activar a un usuario
 async activateUser(id: string): Promise<IUser | null> {
  return await User.findByIdAndUpdate(id, { activo: true }, { new: true });
 }

  // desactivar a un usuario
  async deactivateUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, { activo: false }, { new: true });
  }

  // verificar credenciales para el login
  async verifyCredentials(email: string, password: string): Promise<IUser | null> {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return null;

  const isValidPassword = await bcrypt.compare(password, user.password);
  return isValidPassword ? user : null;
  }

  // Cambiar contraseña de un usuario
  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await User.findById(id);
    if (!user) return false;

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();
    return true;
  }

  //buscar usuario por email
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  

}