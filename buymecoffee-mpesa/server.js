const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  shortCode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  callbackUrl: process.env.MPESA_CALLBACK_URL,
  baseUrl: process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
};

function getTimestamp() {
  const date = new Date();
  const pad = (number) => String(number).padStart(2, '0');

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join('');
}

function validateConfig() {
  const missing = Object.entries({
    MPESA_CONSUMER_KEY: CONFIG.consumerKey,
    MPESA_CONSUMER_SECRET: CONFIG.consumerSecret,
    MPESA_SHORTCODE: CONFIG.shortCode,
    MPESA_PASSKEY: CONFIG.passkey,
    MPESA_CALLBACK_URL: CONFIG.callbackUrl
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    const message = `Missing Daraja config values: ${missing.join(', ')}`;
    const error = new Error(message);
    error.status = 500;
    throw error;
  }
}

async function generateAccessToken() {
  validateConfig();

  const tokenUrl = `${CONFIG.baseUrl}/oauth/v1/generate?grant_type=client_credentials`;
  const auth = Buffer.from(`${CONFIG.consumerKey}:${CONFIG.consumerSecret}`).toString('base64');

  const response = await axios.get(tokenUrl, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });

  return response.data.access_token;
}

function normalizePhoneNumber(phone) {
  const trimmed = String(phone).replace(/\s+/g, '');

  if (/^254\d{9}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^0\d{9}$/.test(trimmed)) {
    return `254${trimmed.slice(1)}`;
  }

  if (/^\+254\d{9}$/.test(trimmed)) {
    return trimmed.slice(1);
  }

  return null;
}

app.post('/api/stkpush', async (req, res) => {
  try {
    const { amount, phone, name } = req.body;
    const parsedAmount = Number(amount);
    const formattedPhone = normalizePhoneNumber(phone);

    if (!Number.isInteger(parsedAmount) || parsedAmount < 1) {
      return res.status(400).json({ error: 'Amount must be a positive integer.' });
    }

    if (!formattedPhone) {
      return res.status(400).json({ error: 'Phone number must be a valid Safaricom number.' });
    }

    const accessToken = await generateAccessToken();
    const timestamp = getTimestamp();
    const password = Buffer.from(`${CONFIG.shortCode}${CONFIG.passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: CONFIG.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: parsedAmount,
      PartyA: formattedPhone,
      PartyB: CONFIG.shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: CONFIG.callbackUrl,
      AccountReference: 'BuyMeCoffee',
      TransactionDesc: `Coffee support from ${name || 'Anonymous'}`
    };

    const endpoint = `${CONFIG.baseUrl}/mpesa/stkpush/v1/processrequest`;
    const stkResponse = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return res.status(200).json({
      message: 'STK Push sent. Complete the payment on your phone.',
      data: stkResponse.data
    });
  } catch (error) {
    const status = error.status || error.response?.status || 500;
    const details = error.response?.data || null;

    return res.status(status).json({
      error: error.message || 'Failed to initiate STK push.',
      details
    });
  }
});

app.post('/api/callback', (req, res) => {
  console.log('Daraja Callback:', JSON.stringify(req.body));
  return res.json({ ResultCode: 0, ResultDesc: 'Callback received successfully' });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const port = Number(process.env.PORT) || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`BuyMeCoffee app running on http://localhost:${port}`);
  });
}

module.exports = {
  app,
  normalizePhoneNumber,
  getTimestamp
};
