import { IAdmin } from "../models/Admin";
import { AdminDao } from "../dao/AdminDao";
import { CreateAdminRequest, LoginRequest , UpdateAdminRequest, UpdatePasswordRequest, AdminResponse, LoginResponse } from "../types/admin.types";
import { generateToken, JWTPayload } from "../config/jwt";

export class AdminService {
  private adminDao: AdminDao;

  constructor() {
    this.adminDao = new AdminDao();
  }

  //formateo las respuestas para el frontend
  private formatAdminResponse(admin: IAdmin): AdminResponse {
    return {
      id: admin._id.toString(),
      email: admin.email,
      nombre: admin.nombre,
    }
  }

  // metodo para generar un token de admin
  private generateAdminToken(adminId: string, email: string, nombre: string): string {
    const payload: JWTPayload = {
      userId: adminId,
      email,
      nombre
    }
    return generateToken(payload);
  }

  // metodo para ccrar un nuevo admin
  async createAdmin(adminData: CreateAdminRequest): Promise<AdminResponse> {
    //validar que el email no este en uso
    const emailExist = await this.adminDao.verifyEmail(adminData.email);
    if (emailExist) {
      throw new Error('El email ya esta en uso');
    }

    //creo al admin
    const admin = await this.adminDao.createAdmin(adminData);
    return this.formatAdminResponse(admin);
  }

  // metodo para el login del admin
  async loginAdmin(credential: LoginRequest): Promise<LoginResponse> {
    // verifico las credenciales
    const admin = await this.adminDao.verifyCredentials(credential.email, credential.password);
    if (!admin) {
      throw new Error('Credenciales invalidas');
    }

    //genero el token del admin
    const token = this.generateAdminToken(admin._id.toString(), admin.email, admin.nombre);
    return {
      token,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        nombre: admin.nombre
      }
    };
  }

  //metodo para obtener id por id
  async getAdminById(adminId: string): Promise<AdminResponse | null> {
    const admin = await this.adminDao.getAdminById(adminId);
    return admin ? this.formatAdminResponse(admin) : null;
  }

  // metodo para obtener admin por email
  async getAdminByEmail(email: string): Promise<AdminResponse | null> {
    const admin = await this.adminDao.getAdminByEmail(email);
    return admin ? this.formatAdminResponse(admin) : null;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const admin = await this.adminDao.getAdminById(userId);
    return !!admin;
  }

  async changePassword(userId: string, passwordData: UpdatePasswordRequest): Promise<boolean> {
    const success = await this.adminDao.changePassword(
      userId, 
      passwordData.currentPassword, 
      passwordData.newPassword
    );
    if (!success) {
      throw new Error('Contraseña actual incorrecta');
    }
    return true;
  }
}