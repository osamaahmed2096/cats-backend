## 📦 Tech Stack

- **NestJS** (TypeScript)
- Reads from static `data.json` (no database or auth)

## 🚀 How to Run

```bash
# Install dependencies
yarn install

# Start the server
yarn start
```

The server runs on: `http://localhost:4000`

## 📡 Endpoint

`GET /comms/your-next-delivery/:userId`

This endpoint returns a personalized delivery message for the given user.

## 🧪 Example

### Request

`GET /comms/your-next-delivery/ff535484-6880-4653-b06e-89983ecf4ed5`

### Response
```JSON
{
  "title": "Your next delivery for Dorian and Ocie",
  "message": "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
  "totalPrice": 134.0,
  "freeGift": true
}
```