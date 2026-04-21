import { Test, TestingModule } from '@nestjs/testing';
import { SetsController } from './sets.controller';
import { STORAGE_PROVIDER_TOKEN } from '../storage/storage.interface';

describe('SetsController', () => {
  let controller: SetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SetsController],
      providers: [
        // Le damos un proveedor "falso" para que el controlador pueda inicializarse
        {
          provide: STORAGE_PROVIDER_TOKEN,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue('http://mock-minio.com/file.mp3'),
          },
        },
      ],
    }).compile();

    controller = module.get<SetsController>(SetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});