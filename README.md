# Taru Foundation

Full-stack e-commerce platform for the Taru Foundation marketplace. Buyers can browse and purchase products, sellers (including SHGs) can list and manage products after admin approval, and admins can oversee users, sellers, and orders.

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | React 18, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt |
| Email | Nodemailer (OTP verification, password reset) |

## Features

- Role-based access: **buyer**, **seller**, and **admin**
- Email OTP registration and password reset
- Product catalog, cart, checkout, and order tracking
- Seller onboarding with admin approval workflow
- Admin dashboards for users, approvals, and orders
- Invoice generation (PDF)
- Payment records

## Project structure

```
Taru_Foundation/
└── Project/
    ├── Backend/          # Express API
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── utils/
    │   ├── seedAdmin.js
    │   └── server.js
    └── FrontEnd/         # React (Vite) app
        └── src/
            ├── api/
            ├── components/
            ├── context/
            └── pages/
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/abhiramch018/Taru-Foundation.git
cd Taru-Foundation
```

### 2. Backend setup

```bash
cd Project/Backend
npm install
```

Create a `.env` file in `Project/Backend/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_email_app_password
FRONTEND_URL=http://localhost:5173
```

Start the API:

```bash
node server.js
```

The API runs at `http://localhost:5000` (or the port in `.env`).

Optional — seed the main admin account (`admin@tarufoundation.org`):

```bash
node seedAdmin.js your_admin_password
```

### 3. Frontend setup

```bash
cd Project/FrontEnd
npm install
```

Create a `.env` file in `Project/FrontEnd/` (optional for local dev; Vite proxies `/api` to `http://localhost:5000`):

```env
VITE_API_URL=http://localhost:5000
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:5173`.

## API overview

| Prefix | Purpose |
| --- | --- |
| `/api/auth` | Register, OTP, login, password reset, seller apply |
| `/api/products` | Product CRUD / listing |
| `/api/cart` | Cart operations |
| `/api/orders` | Orders and tracking |
| `/api/payments` | Payment records |
| `/api/invoices` | Invoice generation |
| `/api/admin` | Admin management |
| `/api/email` | Email-related endpoints |

## Deployment notes

- **Frontend**: configured for Vercel (`vercel.json` SPA rewrites).
- **Backend**: production API base URL falls back to the Render deployment when `VITE_API_URL` is not set.
- Do not commit `.env` files. Both Backend and FrontEnd `.gitignore` already exclude them.

## License

ISC
