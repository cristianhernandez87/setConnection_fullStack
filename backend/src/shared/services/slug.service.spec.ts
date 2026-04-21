import { SlugService } from './slug.service';

describe('SlugService', () => {
  let service: SlugService;

  beforeEach(() => {
    service = new SlugService();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería limpiar caracteres especiales y espacios del nombre del archivo', () => {
    const result = service.cleanFileName('DJ Mix - Verano 2026! @.mp3');
    expect(result).toBe('dj-mix-verano-2026.mp3');
  });

  it('debería manejar acentos y mayúsculas correctamente', () => {
    const result = service.cleanFileName('SesiÓn TÉCHNO increíble.WAV');
    expect(result).toBe('sesion-techno-increible.WAV');
  });
});