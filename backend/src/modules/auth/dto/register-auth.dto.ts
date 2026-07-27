import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRole {
  DJ = 'DJ',
  FAN = 'FAN',
}

export class RegisterAuthDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @IsNotEmpty()
  email!: string; // 🔥 Agregamos el signo ! para asegurar que no es undefined

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password!: string; // 🔥 Agregamos el signo !

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserRole, { message: 'El rol debe ser DJ o FAN.' })
  @IsOptional()
  role?: UserRole = UserRole.FAN;
}