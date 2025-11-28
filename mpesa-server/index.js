require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const MPESA_OAUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

function getTimestamp() {
  const d = new Date();
  const YYYY = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${YYYY}${MM}${DD}${hh}${mm}${ss}`;
}

async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error('MPESA_CONSUMER_KEY/SECRET not set');

  const b64 = Buffer.from(`${key}:${secret}`).toString('base64');
  const resp = await axios.get(MPESA_OAUTH_URL, { headers: { Authorization: `Basic ${b64}` } });
  return resp.data.access_token;
}

app.get('/', (req, res) => res.send('Tazamall M-Pesa demo server running'));

// Endpoint to initiate STK Push
app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    const { phone, amount, accountRef = 'Tazamall', description = 'Tazamall Order' } = req.body;
    if (!phone || !amount) return res.status(400).json({ error: 'phone and amount required' });

    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const shortcode = process.env.BUSINESS_SHORTCODE;
    const passkey = process.env.PASSKEY;
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: accountRef,
      TransactionDesc: description
    };

    const resp = await axios.post(MPESA_STK_URL, body, { headers: { Authorization: `Bearer ${accessToken}` } });
    return res.json(resp.data);
  } catch (err) {
    console.error('STK Push error', err.response ? err.response.data : err.message);
    return res.status(500).json({ error: 'STK push failed', details: err.response ? err.response.data : err.message });
  }
});

// Webhook endpoint that Safaricom will call with payment result
app.post('/api/mpesa/webhook', (req, res) => {
  console.log('Received MPesa webhook:', JSON.stringify(req.body, null, 2));
  // TODO: verify and persist payment result, update order status in DB
  // For demo, we just return 200 OK
  res.status(200).send({ result: 'Accepted' });
});

app.listen(PORT, () => console.log(`MPesa demo server listening on port ${PORT}`));
