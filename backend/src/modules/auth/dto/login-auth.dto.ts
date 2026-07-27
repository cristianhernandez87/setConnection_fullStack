import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @IsNotEmpty()
  email!: string; // 🔥 Agregamos el signo !

  @IsString()
  @IsNotEmpty()
  password!: string; // 🔥 Agregamos el signo !
}