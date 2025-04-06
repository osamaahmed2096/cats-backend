import { Test, TestingModule } from '@nestjs/testing';
import { CommsController } from './comms.controller';
import { CommsService } from './comms.service';
import { UsersNextDeliveryDto } from './dto/users-next-delivery.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CommsController', () => {
  let controller: CommsController;
  let service: CommsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommsController],
      providers: [
        {
          provide: CommsService,
          useValue: {
            getUsersNextDelivery: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommsController>(CommsController);
    service = module.get<CommsService>(CommsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsersNextDelivery', () => {
    it('should return a valid UsersNextDeliveryDto object when given a valid customer id', () => {
      const customerId = 'customer-123';
      const expectedResult: UsersNextDeliveryDto = {
        title: 'Your next delivery for Whiskers and Fluffy',
        message: 'Hey John! In two days\' time, we\'ll be charging you for your next order for Whiskers and Fluffy\'s fresh food.',
        totalPrice: 115,
        freeGift: false,
      };
      
      jest.spyOn(service, 'getUsersNextDelivery').mockReturnValue(expectedResult);

      const result = controller.getUsersNextDelivery(customerId);

      expect(result).toEqual(expectedResult);
      expect(service.getUsersNextDelivery).toHaveBeenCalledWith(customerId);
    });

    it('should return a UsersNextDeliveryDto with freeGift set to true when total price > 120', () => {
      const customerId = 'customer-456';
      const expectedResult: UsersNextDeliveryDto = {
        title: 'Your next delivery for Whiskers, Fluffy and Mittens',
        message: 'Hey Jane! In two days\' time, we\'ll be charging you for your next order for Whiskers, Fluffy and Mittens\'s fresh food.',
        totalPrice: 130,
        freeGift: true,
      };
      
      jest.spyOn(service, 'getUsersNextDelivery').mockReturnValue(expectedResult);
      const result = controller.getUsersNextDelivery(customerId);

      expect(result).toEqual(expectedResult);
      expect(result.freeGift).toBe(true);
      expect(service.getUsersNextDelivery).toHaveBeenCalledWith(customerId);
    });

    it('should pass through BadRequestException when an empty id is provided', () => {
      const emptyId = '';
      jest.spyOn(service, 'getUsersNextDelivery').mockImplementation(() => {
        throw new BadRequestException('Id is required');
      });

      expect(() => controller.getUsersNextDelivery(emptyId)).toThrow(BadRequestException);
      expect(service.getUsersNextDelivery).toHaveBeenCalledWith(emptyId);
    });

    it('should pass through NotFoundException when customer is not found', () => {
      const nonExistentId = 'non-existent-id';
      jest.spyOn(service, 'getUsersNextDelivery').mockImplementation(() => {
        throw new NotFoundException('Customer not found');
      });

      expect(() => controller.getUsersNextDelivery(nonExistentId)).toThrow(NotFoundException);
      expect(service.getUsersNextDelivery).toHaveBeenCalledWith(nonExistentId);
    });

    it('should pass through NotFoundException when customer has no active cats', () => {
      const customerId = 'customer-with-no-active-cats';
      jest.spyOn(service, 'getUsersNextDelivery').mockImplementation(() => {
        throw new NotFoundException('Customer has no active cats');
      });

      expect(() => controller.getUsersNextDelivery(customerId)).toThrow(NotFoundException);
      expect(service.getUsersNextDelivery).toHaveBeenCalledWith(customerId);
    });
  });
});
