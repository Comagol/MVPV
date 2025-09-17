import { UserService } from "./UserService";
import { AdminService } from "./AdminService";
import { LoginRequest, LoginResponse } from "../types/auth.types";

export class AuthService {
  private userService: UserService;
  private adminService: AdminService;

  constructor() {
    this.userService = new UserService();
    this.adminService = new AdminService();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const adminResult = await this.adminService.loginAdmin(credentials);
      return {
        ...adminResult,
        userType: 'admin'
      }
    } catch (adminError) {
      try {
        const userResult = await this.userService.login(credentials);
        return {
          ...userResult,
          userType: 'user'
        }
      } catch (userError) {
        throw new Error('Credenciales invalidas');
      }
    }
  }
}