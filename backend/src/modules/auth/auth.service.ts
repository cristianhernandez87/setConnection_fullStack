import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterAuthDto, UserRole } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  // En un entorno de producción, aquí inyectarías @InjectRepository(UserEntity)
  // Simulación en memoria para validar el flujo arquitectónico rápido:
  private mockUsers: Array<any> = [];

  constructor(private jwtService: JwtService) {}

  async register(dto: RegisterAuthDto) {
    const existingUser = this.mockUsers.find((u) => u.email === dto.email);
    if (existingUser) {
      throw new BadRequestException(
        'Este correo electrónico ya está registrado.',
      );
    }

    // 🔥 Hashing de contraseña (Defensive Programming)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = {
      id: 'u-' + Date.now(),
      email: dto.email,
      name: dto.name || dto.email.split('@')[0].toUpperCase(),
      password: hashedPassword,
      role: dto.role || UserRole.FAN,
    };

    this.mockUsers.push(newUser);
    return this.generateTokenResponse(newUser);
  }

  async login(dto: LoginAuthDto) {
    const user = this.mockUsers.find((u) => u.email === dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // Validar contraseña contra el hash
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return this.generateTokenResponse(user);
  }

  private generateTokenResponse(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}