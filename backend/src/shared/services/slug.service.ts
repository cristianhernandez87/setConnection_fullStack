/* eslint-disable no-useless-escape */
import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugService {
  slugify(text: string): string {
    return text
      .toString()
      .normalize('NFD') // 1. Separa los acentos de las letras
      .replace(/[\u0300-\u036f]/g, '') // 2. Elimina los acentos
      .toLowerCase() // 3. Convierte todo a minúsculas
      .trim() // 4. Quita espacios al inicio y al final
      .replace(/\s+/g, '-') // 5. Cambia los espacios internos por guiones
      .replace(/[^\w\-]+/g, '') // 6. ¡ESTA ES LA LÍNEA QUE ELIMINA ! Y @!
      .replace(/\-\-+/g, '-') // 7. Evita que queden guiones dobles (--)
      .replace(/^-+|-+$/g, ''); // 8. Elimina guiones sueltos en los extremos
  }

  cleanFileName(originalName: string): string {
    const parts = originalName.split('.');
    const extension = parts.pop();
    const name = parts.join('.');
    const cleanName = this.slugify(name);
    return `${cleanName}.${extension}`;
  }
}
