# M-Pesa Daraja Integration (Sandbox) for Tazamall

This project includes a simple demo Node.js server under `mpesa-server/` to initiate an M-Pesa Daraja STK Push (sandbox) and accept the webhook callback.

Important: This code is a sandbox/demo integration. Do NOT use it in production without adding strong verification, logging, secure storage of credentials, and HTTPS. For production you must also complete KYC and other requirements with Safaricom/your payment provider.

Quick setup (local sandbox):

1. Copy `.env.example` and fill in your Daraja sandbox credentials.

   - Create an account at https://developer.safaricom.co.ke/ and create an app to get `consumer_key` and `consumer_secret`.
   - Use the provided sandbox `BusinessShortCode` (e.g. `174379`) and get the `PASSKEY` from your app settings.

2. Start the server:

```powershell
cd mpesa-server
npm install
npm start
```

3. Expose the server to the public internet (required for Daraja callbacks) using `ngrok` or another tunnel. Example with ngrok:

```powershell
# from project root
ngrok http 3000
```

Copy the generated `https://...ngrok.io` URL and set `CALLBACK_URL` in your `.env` to `https://<your-ngrok>.ngrok.io/api/mpesa/webhook` and restart the server.

4. Serve the frontend files (your `Tazamall.html` and others) from a local server (opening HTML with `file://` will block fetch calls). You can use `npx http-server` or the VS Code Live Server extension.

5. Use the checkout page: on checkout, enter your phone number in international format (e.g., `2547XXXXXXXX`) when the M-Pesa popup appears. The sandbox will push a payment request to that phone (or to the sandbox test number), and Safaricom will call your webhook with the result.

Notes & next steps:
- The server logs the webhook payload to console. You should persist payment confirmations to a database and verify the callback signature before trusting it.
- For production, move credentials to a secure secret store and serve over HTTPS.
- If you prefer, I can extend the server to also serve your static frontend so you can run the entire app from one process.
