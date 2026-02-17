process.env.MPESA_CONSUMER_KEY = 'key';
process.env.MPESA_CONSUMER_SECRET = 'secret';
process.env.MPESA_SHORTCODE = '174379';
process.env.MPESA_PASSKEY = 'passkey';
process.env.MPESA_CALLBACK_URL = 'https://example.com/callback';
process.env.MPESA_ENV = 'sandbox';

const request = require('supertest');
const axios = require('axios');
const { app, normalizePhoneNumber, getTimestamp } = require('../server');

jest.mock('axios');

describe('utility functions', () => {
  test('normalizePhoneNumber handles multiple valid formats', () => {
    expect(normalizePhoneNumber('0712345678')).toBe('254712345678');
    expect(normalizePhoneNumber('254712345678')).toBe('254712345678');
    expect(normalizePhoneNumber('+254712345678')).toBe('254712345678');
    expect(normalizePhoneNumber('12345')).toBeNull();
  });

  test('getTimestamp returns YYYYMMDDHHmmss', () => {
    expect(getTimestamp()).toMatch(/^\d{14}$/);
  });
});

describe('API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('health endpoint works', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('returns 400 for invalid amount', async () => {
    const res = await request(app).post('/api/stkpush').send({
      phone: '0712345678',
      amount: 0
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Amount/);
  });

  test('sends STK push for valid input', async () => {
    axios.get.mockResolvedValueOnce({ data: { access_token: 'token123' } });
    axios.post.mockResolvedValueOnce({ data: { ResponseCode: '0' } });

    const res = await request(app).post('/api/stkpush').send({
      phone: '0712345678',
      amount: 100,
      name: 'Jane'
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/STK Push sent/i);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});
