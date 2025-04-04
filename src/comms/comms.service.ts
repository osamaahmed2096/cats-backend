import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UsersNextDeliveryDto } from './dto/users-next-delivery.dto';
import { readFileSync } from 'fs';
import { Customer, Cat } from './interfaces/customer.interface';
import { POUCH_PRICES } from './constants/prices.constant';

@Injectable()
export class CommsService {
    private readonly customers: Customer[] = [];

    constructor() {
        try {
            const data = readFileSync('data.json', 'utf8');
            this.customers = JSON.parse(data);
        } catch (error) {
            throw new InternalServerErrorException('Error reading data.json');
        }
    }

  getUsersNextDelivery(id: string): UsersNextDeliveryDto {
    const customer = this.customers.find((customer: Customer) => customer.id === id);

    if (!customer) {
        throw new NotFoundException('Customer not found');
    }

    const formattedCats = this.getFormattedCats(customer);
    const totalPrice = this.getTotalPrice(customer);

    return {
        title: `Your next delivery for ${formattedCats}`,
        message: `Hey ${customer.firstName}! In two days' time, we'll be charging you for your next order for ${formattedCats}'s fresh food.`,
        totalPrice: totalPrice,
        freeGift: totalPrice > 120
    }
  }

  private getFormattedCats(customer: Customer): string {
    const activeCats = customer.cats.filter((cat: Cat) => cat.subscriptionActive);
    return activeCats.map((cat: Cat) => cat.name).join(', ').replace(/, ([^,]*)$/, ' and $1');
  }

  private getTotalPrice(customer: Customer): number {
    return customer.cats.reduce((acc: number, cat: Cat) => acc + POUCH_PRICES[cat.pouchSize], 0);
  }
}
