import { Injectable } from '@nestjs/common';
import { UsersNextDeliveryDto } from './dto/users-next-delivery.dto';
import { readFileSync } from 'fs';

const data = readFileSync('data.json', 'utf8');
const customers = JSON.parse(data);

const POUCH_PRICES = {
    A: 55.50,
    B: 59.50,
    C: 62.75,
    D: 66.00,
    E: 69.00,
    F: 71.25,
} as Record<string, number>;

@Injectable()
export class CommsService {
  getUsersNextDelivery(id: string): UsersNextDeliveryDto {
    const customer = customers.find((customer: any) => customer.id === id);
    const activeCats = customer.cats.filter((cat: any) => cat.subscriptionActive);
    const formattedCats = activeCats.map((cat: any) => cat.name).join(', ').replace(/, ([^,]*)$/, ' and $1');
    const totalPrice = activeCats.reduce((acc: number, cat: any) => acc + POUCH_PRICES[cat.pouchSize], 0);

    return {
        title: `Your next delivery for ${formattedCats}`,
        message: `Hey ${customer.firstName}! In two days' time, we'll be charging you for your next order for ${formattedCats}'s fresh food.`,
        totalPrice: totalPrice,
        freeGift: totalPrice > 120
    }
  }
}
