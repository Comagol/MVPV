import { Admin, IAdmin } from "../models/Admin";
import { CreateAdminRequest, UpdateAdminRequest } from "../types/admin.types";
import bcrypt from 'bcryptjs';

export class AdminDao {

  //crear un nuevo administrador
  async createAdmin(adminData: CreateAdminRequest): Promise<IAdmin> {
    const admin = new Admin(adminData);
    return await admin.save();
  }

  //obtener un admin por id
  async getAdminById(id: string): Promise<IAdmin | null> {
    return await Admin.findById(id);
  }

  //obtener admin por email
  async getAdminByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email: email.toLowerCase() });
  }

  //verificar credenciales para el login
  async verifyCredentials(email: string, password: string): Promise<IAdmin | null> {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return null;

    const isValidPassword = await bcrypt.compare(password, admin.password);
    return isValidPassword ? admin : null;
  }

  //cambiar contraseña de un admin
  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const admin = await Admin.findById(id);
    if (!admin) return false;

    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!isValidPassword) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    return true;
  }

  //actualizar informacion de un admin
  async updateAdmin(id: string, updateData: UpdateAdminRequest): Promise<IAdmin | null> {
    return await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
  }

  //verificar si el email ya existe
  async verifyEmail(email: string): Promise<boolean> {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    return !!admin;
  }
}