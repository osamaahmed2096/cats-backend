import { Controller, Get, Param } from '@nestjs/common';
import { CommsService } from './comms.service';
import { UsersNextDeliveryDto } from './dto/users-next-delivery.dto';

@Controller('comms')
export class CommsController {
  constructor(private readonly commsService: CommsService) {}

  @Get('/your-next-delivery/:id')
  getUsersNextDelivery(@Param('id') id: string): UsersNextDeliveryDto {
    return this.commsService.getUsersNextDelivery(id);
  }
}
