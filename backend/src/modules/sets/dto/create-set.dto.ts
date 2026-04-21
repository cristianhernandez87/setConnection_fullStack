import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateSetDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'El título del set es obligatorio' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MaxLength(100, { message: 'El título no puede tener más de 100 caracteres' })
  title: string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  description?: string;
}
