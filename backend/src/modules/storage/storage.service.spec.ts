import { S3StorageProvider } from './storage.service';

describe('S3StorageProvider', () => {
  let provider: S3StorageProvider;

  beforeEach(() => {
    // Simulamos el ConfigService básico para no depender de variables de entorno reales
    const mockConfigService = {
      get: jest.fn().mockReturnValue('localhost'),
    } as any;

    // Instanciamos la clase correcta
    provider = new S3StorageProvider(mockConfigService);
  });

  it('debería estar definido', () => {
    expect(provider).toBeDefined();
  });
});
