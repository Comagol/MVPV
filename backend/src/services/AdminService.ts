import { IAdmin } from "../models/Admin";
import { AdminDao } from "../dao/AdminDao";
import { CreateAdminRequest, LoginRequest , UpdateAdminRequest, UpdatePasswordRequest, AdminResponse } from "../types/admin.types";
import { generateToken, JWTPayload } from "../config/jwt";

export class AdminService {
  private adminDao: AdminDao;

  constructor() {
    this.adminDao = new AdminDao();
  }

  //formateo las respuestas para el frontend
  private formarAdminResponse(admin: IAdmin): AdminResponse {
    return {
      id: admin._id.toString(),
      email: admin.email,
      nombre: admin.nombre,
    }
  }
}