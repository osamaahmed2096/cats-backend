import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
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
    // Added this check to ensure the id is provided
    // Didn't feel the need to use a DTO for this as it's just a single ID being passed in
    if (!id) {
        throw new BadRequestException('Id is required');
    }

    const customer = this.customers.find((customer: Customer) => customer.id === id);

    if (!customer) {
        throw new NotFoundException('Customer not found');
    }

    const customersCats = customer.cats;

    if (customersCats.length === 0 || customersCats.every((cat: Cat) => !cat.subscriptionActive)) {
        throw new NotFoundException('Customer has no active cats');
    }

    const formattedCats = this.getFormattedCats(customersCats);
    const totalPrice = this.getTotalPrice(customersCats);

    return {
        title: `Your next delivery for ${formattedCats}`,
        message: `Hey ${customer.firstName}! In two days' time, we'll be charging you for your next order for ${formattedCats}'s fresh food.`,
        totalPrice: totalPrice,
        freeGift: totalPrice > 120
    }
  }

  private getFormattedCats(cats: Cat[]): string {
    const activeCats = cats.filter((cat: Cat) => cat.subscriptionActive);
    return activeCats.map((cat: Cat) => cat.name).join(', ').replace(/, ([^,]*)$/, ' and $1');
  }

  private getTotalPrice(cats: Cat[]): number {
    return cats.reduce((acc: number, cat: Cat) => acc + POUCH_PRICES[cat.pouchSize], 0);
  }
}
