import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export enum UserRole {
  DJ = 'DJ',
  FAN = 'FAN',
}

export class RegisterAuthDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número o carácter especial.',
  })
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserRole, { message: 'El rol debe ser DJ o FAN.' })
  @IsOptional()
  role?: UserRole = UserRole.FAN;
}
