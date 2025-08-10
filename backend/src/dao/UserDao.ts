import { User, IUser } from "../models/User";
import { CreateUserRequest, UserResponse } from "../types/user.types";
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

  // incrementar votos de un usuario
  async incrementVotes(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      {
        $inc: { votos: 1},
        ultimoVoto: new Date()
      },
      { new: true }
    );
  }

  
}