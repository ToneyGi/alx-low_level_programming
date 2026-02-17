# BuyMeCoffee + M-Pesa Daraja 2.0

A production-ready starter for a **Buy Me Coffee** web page integrated with **Safaricom M-Pesa Daraja 2.0 STK Push**, inspired by the flow in the Next.js Daraja docs.

## Features

- Modern single-page BuyMeCoffee form.
- Daraja OAuth token generation.
- STK Push request endpoint (`/api/stkpush`).
- Callback endpoint (`/api/callback`).
- Input validation for amount and phone number.
- Unit/API tests with Jest + Supertest.

## Quick Start

```bash
cd buymecoffee-mpesa
npm install
cp .env.example .env
```

Update `.env` with your Daraja credentials.

Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

- `PORT`: App port.
- `MPESA_ENV`: `sandbox` or `production`.
- `MPESA_CONSUMER_KEY`: Daraja app key.
- `MPESA_CONSUMER_SECRET`: Daraja app secret.
- `MPESA_SHORTCODE`: Paybill/Till shortcode.
- `MPESA_PASSKEY`: Daraja online passkey.
- `MPESA_CALLBACK_URL`: Public callback URL.

## Testing

```bash
npm test
```

## Daraja Callback Notes

For local development, expose your app publicly using tools like ngrok and set:

- `MPESA_CALLBACK_URL=https://<public-domain>/api/callback`

The app logs callback payloads and replies with a success result code.
