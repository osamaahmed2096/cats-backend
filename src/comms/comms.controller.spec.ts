import { Test, TestingModule } from '@nestjs/testing';
import { CommsController } from './comms.controller';

describe('CommsController', () => {
  let controller: CommsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommsController],
    }).compile();

    controller = module.get<CommsController>(CommsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
