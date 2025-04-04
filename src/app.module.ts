import { Module } from '@nestjs/common';
import { CommsController } from './comms/comms.controller';
import { CommsModule } from './comms/comms.module';
import { CommsService } from './comms/comms.service';

@Module({
  imports: [CommsModule],
  controllers: [CommsController],
  providers: [CommsService],
})
export class AppModule {}
