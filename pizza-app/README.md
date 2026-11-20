# Crust & Co. Pizza App

A React and Vite customer site with an Express, MongoDB, and Socket.io API. Checkout is wired for Razorpay **test mode**. Emails are sent when SMTP credentials are configured; without SMTP the app logs the email content to the server console for local development.

## Requirements

- Node.js 20 or newer and npm
- MongoDB running locally or a MongoDB connection string
- Razorpay test keys for checkout

## Start on Windows Command Prompt

In the first `cmd` window:

```cmd
cd pizza-app\server
npm install
copy .env.example .env
```

Edit `server\.env` with your MongoDB URI, a long random `JWT_SECRET`, and Razorpay test keys. Then run:

```cmd
npm run seed
npm run dev
```

In a second `cmd` window:

```cmd
cd pizza-app\client
npm install
copy .env.example .env
npm run dev
```

Open <http://localhost:5173>. API: <http://localhost:5000/api/health>.

## Email setup

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM` in `server\.env`. Mailtrap is suitable for development. Gmail requires an app password with two-step verification enabled. Verification and reset links use `CLIENT_URL`.

## Razorpay test setup

Create a Razorpay account, switch to Test Mode, and copy the test Key ID and Key Secret from the dashboard into `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Use Razorpay's current test card or test UPI values shown in its test mode documentation; test payment data must never be replaced with real card details in this app. The browser key is configured separately in `client\.env` as `VITE_RAZORPAY_KEY_ID` if needed by custom integrations.

## Admin access

The seed creates the admin only if it does not already exist. Defaults are `admin@pizzaapp.com` / `Admin@12345`; set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before seeding to use your own credentials. Sign in at `/admin/login`. Change the default password before exposing this app beyond local development.

## Main flows

- Register, verify by emailed link, sign in, build a pizza, and pay through the Razorpay test checkout.
- Admins can review paid orders and move them from Order Received to In Kitchen to Sent to Delivery.
- Stock is checked on checkout and deducted only after the payment signature is verified. The scheduler checks for low stock and sends a grouped alert when SMTP is configured.
- The API exposes `/api/orders/summary`, `/api/pizzas`, `/api/options`, `/api/admin/inventory`, and `/api/admin/orders` alongside auth and checkout routes.

## Notes

MongoDB and configured payment/email credentials are required for the complete live flow. The app does not collect or store card data. Never commit `.env` files.
