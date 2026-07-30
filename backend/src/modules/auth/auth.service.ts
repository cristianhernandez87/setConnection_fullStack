import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../auth/entities/user.entity';
import { RegisterAuthDto, UserRole } from './dto/authRegister.dto';
import { LoginAuthDto } from './dto/authLogin.dto';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordDto } from './dto/authForgotPass.dto';
import { ResetPasswordDto } from './dto/authResetPass.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterAuthDto) {
    const { email, password, name, role } = dto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      role: role || UserRole.FAN,
    });

    const savedUser = await this.userRepository.save(newUser);
    const token = this.generateJwtToken(savedUser);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
      },
      token,
    };
  }

  async login(dto: LoginAuthDto) {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const token = this.generateJwtToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  private generateJwtToken(user: User): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return {
        message:
          'Si el correo está registrado, recibirás un enlace de recuperación.',
      };
    }

    const resetToken = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expires;

    await this.userRepository.save(user);
    await this.mailService.sendResetPasswordEmail(email, resetToken);

    return {
      message:
        'Si el correo está registrado, recibirás un enlace de recuperación.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException(
        'El token de recuperación es inválido o ha expirado.',
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);

    return { message: 'La contraseña ha sido actualizada con éxito.' };
  }
}
