# 🍔 Slooze Food Ordering App

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

A full-stack role-based food ordering application where employees of a company can browse restaurants, create orders, and checkout — with strict access control based on their role and country.

---

## 📋 Problem Statement

Nick Fury is a business owner with 5 employees. He needs a web-based food ordering app where:
- Everyone can **view restaurants and menus**
- Everyone can **create orders and add food items**
- Only **Managers and Admins** can **checkout and pay**
- Only **Managers and Admins** can **cancel orders**
- Only **Admin** can **manage payment methods**

**Bonus:** Users should only see restaurants from their own country (ReBAC).

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS · GraphQL (code-first) · Prisma ORM |
| Database | SQLite |
| Auth | JWT · Passport.js |
| Frontend | Next.js 16 · TypeScript · Tailwind CSS |
| API Client | Apollo Client |

---

## 👥 Users & Roles

| Name | Email | Role | Country |
|------|-------|------|---------|
| Nick Fury | nick@slooze.com | ADMIN | ALL |
| Captain Marvel | marvel@slooze.com | MANAGER | INDIA |
| Captain America | america@slooze.com | MANAGER | AMERICA |
| Thanos | thanos@slooze.com | MEMBER | INDIA |
| Thor | thor@slooze.com | MEMBER | INDIA |
| Travis | travis@slooze.com | MEMBER | AMERICA |

> **Password for all users:** `password123`

---

## 🔐 RBAC — Role Based Access Control

| Feature | Admin | Manager | Member |
|---------|:-----:|:-------:|:------:|
| View restaurants & menu | ✅ | ✅ | ✅ |
| Create order & add items | ✅ | ✅ | ✅ |
| Checkout & pay | ✅ | ✅ | ❌ |
| Cancel order | ✅ | ✅ | ❌ |
| Manage payment methods | ✅ | ❌ | ❌ |

---

## 🌍 ReBAC — Relational Based Access Control (Bonus ✅)

| User | Sees |
|------|------|
| Nick Fury (Admin) | All restaurants — India + America |
| Captain Marvel, Thanos, Thor | India restaurants only |
| Captain America, Travis | America restaurants only |

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/slooze-food-ordering.git
cd slooze-food-ordering
```

### 2. Backend Setup

```bash
cd backend
npm install
npx ts-node --skip-project prisma/seed.ts
npm run build
node dist/src/main.js
```

> Runs on: `http://localhost:4000/graphql`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run build
npx next start -p 3000
```

> Runs on: `http://localhost:3000`

### Development Mode

```bash
# Backend — hot reload
cd backend && npm run start:dev

# Frontend — hot reload
cd frontend && npm run dev
```

---

## 📁 Project Structure

```
slooze-food-ordering/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   ├── seed.ts               # Seed data (6 users, 6 restaurants, 30 menu items)
│   │   └── dev.db                # SQLite database
│   └── src/
│       ├── auth/                 # JWT auth, guards, decorators
│       ├── restaurants/          # Restaurant & menu queries (ReBAC filter)
│       ├── orders/               # Order CRUD with RBAC
│       ├── payments/             # Payment methods (Admin only)
│       └── prisma/               # Prisma service
└── frontend/
    ├── app/
    │   ├── login/                # Login page with quick-login panel
    │   ├── dashboard/            # Dashboard with stats & recent orders
    │   ├── restaurants/          # Browse & order (bento grid layout)
    │   ├── orders/               # View, checkout, cancel orders
    │   └── payments/             # Manage payment methods (Admin only)
    ├── components/
    │   └── AppShell.tsx          # Shared header + bottom nav
    └── lib/
        ├── apollo.tsx            # Apollo Client setup
        ├── auth.tsx              # Auth context
        └── queries.ts            # GraphQL queries & mutations
```

---

## 🔌 GraphQL API

**Endpoint:** `http://localhost:4000/graphql`

### Mutations

| Mutation | Access | Description |
|----------|--------|-------------|
| `login(email, password)` | Public | Returns JWT token + user |
| `createOrder()` | All | Create new pending order |
| `addItemToOrder(orderId, menuItemId, quantity)` | All | Add item to order |
| `placeOrder(orderId, paymentMethodId)` | Admin · Manager | Checkout & pay |
| `cancelOrder(orderId)` | Admin · Manager | Cancel an order |
| `addPaymentMethod(type, last4, holderName)` | Admin only | Add payment method |
| `updatePaymentMethod(id, type, last4, holderName)` | Admin only | Update payment method |
| `deletePaymentMethod(id)` | Admin only | Delete payment method |

### Queries

| Query | Access | Description |
|-------|--------|-------------|
| `restaurants` | All (auth) | Filtered by user's country (ReBAC) |
| `restaurant(id)` | All (auth) | Single restaurant with menu |
| `myOrders` | All (auth) | Current user's orders |
| `myPaymentMethods` | All (auth) | Current user's payment methods |
| `allPaymentMethods` | All (auth) | All payment methods (for checkout) |

---

## 📮 API Collection

Import `Slooze-API-Collection.postman_collection.json` into Postman to test all endpoints.

**How to use:**
1. Run **"Login - Nick Fury"** → token auto-saves as collection variable
2. Use any other request — token is automatically attached
3. Switch users by running a different login request

---

## 🏗 Architecture

```
Browser (Next.js + Apollo Client)
           ↓  GraphQL over HTTP
    NestJS Backend (Port 4000)
           ↓  Prisma ORM
       SQLite Database
```

### Auth Flow
1. User logs in → JWT issued with `{ id, email, role, country }`
2. Token stored in `localStorage`
3. Every GraphQL request sends `Authorization: Bearer <token>`
4. Backend guards validate role + country on every resolver

### RBAC Implementation
- `@Roles('ADMIN', 'MANAGER')` decorator on resolvers
- `RolesGuard` reads role from JWT and enforces access
- Frontend hides/disables UI elements based on role
- Backend rejects unauthorized calls — **double protection**

### ReBAC Implementation
- `country` field embedded in JWT payload
- `RestaurantsService.findAll(country)` filters by country
- `ADMIN` has `country: 'ALL'` → sees all restaurants
- Others see only their country's restaurants

---

## 🌱 Seed Data

- **6 users** — 1 Admin, 2 Managers, 3 Members across India & America
- **6 restaurants** — 3 Indian, 3 American
- **30 menu items** — 5 per restaurant
- **2 payment methods** — pre-seeded for Nick Fury (Admin)
