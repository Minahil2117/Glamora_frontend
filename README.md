<div align="center">

# 👗 GLAMORA

### *Timeless. Elegant. Unforgettable.*

**A premium AI-powered luxury fashion e-commerce experience** built with React, TypeScript & Tailwind CSS.

Glamora blends high-end editorial design with intelligent shopping features — including an **AI Stylist chatbot**, **Virtual Try-On**, an **AI Size Advisor**, multi-method checkout, and persistent cart/wishlist/order history.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br>

**Shop** · **AI Stylist** · **Virtual Try-On** · **Size Advisor** · **Orders**

</div>

---

## 📑 Table of Contents

- [✨ Overview](#-overview)
- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔌 Backend Integration (PHP API)](#-backend-integration-php-api)
- [🤖 AI Stylist — Keyword Guide](#-ai-stylist--keyword-guide)
- [🎯 Usage Guide](#-usage-guide)
- [🎨 Design System](#-design-system)
- [📸 Screenshots](#-screenshots)
- [🛣️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Overview

**Glamora** is a full-featured luxury fashion storefront concept that recreates the feel of a high-end boutique online. Beyond a standard product catalog, it ships with genuinely useful smart shopping tools:

- 🧠 A **conversational AI Stylist** that recommends curated looks based on the occasion you describe.
- 📐 An **AI Size Advisor** that calculates your recommended size from body measurements.
- 👗 A **Virtual Try-On** preview modal for any product.
- 💳 A **multi-method checkout** (Card / UPI / Cash on Delivery) with an order summary.
- 💾 **Persistent state** — cart, wishlist, and orders survive page reloads via `localStorage`.

The UI follows an elegant editorial aesthetic with a warm cream + deep wine palette, serif display typography, and smooth Framer Motion animations.

---

## 🚀 Features

### 🛍️ Shop & Catalog
- 14 curated luxury products across **5 categories** (Dresses, Tops, Bottoms, Outerwear, Accessories)
- **Live search** across name, description, and category
- **Category filtering** with pill toggles
- **Price range slider** filter
- **Sorting** — Featured / Price: Low → High / Price: High → Low
- Responsive product grid with hover zoom effects
- Product detail modal with **size, color & quantity** selection

### 🤖 AI Stylist Chatbot
- Conversational interface with typing indicator
- Curated product recommendations based on the **occasion** you describe
- **One-tap "quick add"** of any recommended item straight to cart
- Quick-reply suggestion chips (Date night, Wedding guest, etc.)

### 📐 AI Size Advisor
- Input **height, weight & bust** via sliders
- Smart sizing algorithm returns a recommended size (XS → L)
- Accessible from product pages and the AI tab

### 👗 Virtual Try-On
- AI-powered preview modal showing the garment on a model placeholder
- Reflects selected color & size

### 🛒 Cart & Wishlist
- Slide-in cart drawer with quantity controls and live totals
- Heart-toggle wishlist with badge counter
- Add-to-cart toasts with **"View Cart"** action

### 💳 Multi-Method Checkout
- **Credit / Debit Card** — auto-formatting card number & expiry fields
- **UPI** — UPI ID entry with provider chips (GPay, PhonePe, Paytm, BHIM)
- **Cash on Delivery** — order up to $500
- Shipping form + live order summary (subtotal, tax, total)
- Order persistence to **localStorage** *and* optional **PHP backend**

### 📦 Orders
- Full order history with ID, date, status, line items & totals
- Empty-state with a clear call to action

---

## 🛠️ Tech Stack

| Category        | Technology                                                                 |
| --------------- | ------------------------------------------------------------------------- |
| **Framework**   | [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) |
| **Build Tool**  | [Vite 7](https://vitejs.dev/)                                             |
| **Styling**     | [Tailwind CSS 4](https://tailwindcss.com/)                                |
| **Animations**  | [Framer Motion](https://www.framer.com/motion/)                           |
| **Icons**       | [Lucide React](https://lucide.dev/)                                       |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/)                                 |
| **State**       | React `useState` + `localStorage` persistence                             |
| **Backend** *(optional)* | PHP + MySQL REST API                                              |

---

## 📁 Project Structure

```
glamora/
├── index.html               # HTML entry point
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── README.md                # You are here
├── public/                  # Static assets
└── src/
    ├── main.tsx             # React root
    ├── App.tsx              # 💎 Main app (all features & UI)
    ├── index.css            # Global styles / Tailwind imports
    └── utils/
        └── cn.ts            # Tailwind class merge utility
```

> The application logic lives in a single, well-organized `src/App.tsx`. It is composed of clear sections: **Types → Data → AI Logic → State → Cart/Wishlist/Checkout → UI & Modals**.

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) **v18+**
- npm (comes with Node)

### 2. Clone the repository
```bash
git clone https://github.com/<your-username>/glamora.git
cd glamora
```

### 3. Install dependencies
```bash
npm install
```

> ⚠️ **Note:** The app uses `framer-motion`, `lucide-react`, and `sonner`. Install them explicitly if they're missing:
> ```bash
> npm install framer-motion lucide-react sonner
> ```

### 4. Run the development server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

### 5. Build for production
```bash
npm run build
npm run preview      # preview the production build locally
```

The optimized output is generated in the **`dist/`** folder.

---

## 🔌 Backend Integration (PHP API)

The checkout flow is wired to an optional PHP + MySQL backend to **persist orders** in a database.

### Endpoint
```http
POST http://localhost/glamora_backend/api/orders.php
Content-Type: application/json
```

### Request Body
```json
{
  "customer_name": "Isabella Rossi",
  "customer_email": "isabella.rossi@email.com",
  "shipping_address": "24 Rue Saint-Honoré",
  "city": "Paris",
  "postal_code": "75001",
  "items": [
    {
      "product_id": 1,
      "selected_size": "M",
      "selected_color": "Midnight Black",
      "quantity": 1
    }
  ]
}
```

### Suggested Database Schema
```sql
CREATE TABLE orders (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  order_ref     VARCHAR(20) UNIQUE,
  customer_name     VARCHAR(120),
  customer_email    VARCHAR(120),
  shipping_address  VARCHAR(255),
  city              VARCHAR(120),
  postal_code       VARCHAR(20),
  total             DECIMAL(10,2),
  status            VARCHAR(40) DEFAULT 'Confirmed',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  order_id      INT,
  product_id    INT,
  selected_size VARCHAR(20),
  selected_color VARCHAR(60),
  quantity      INT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

> 💡 The app **degrades gracefully** — if the backend is unreachable, the order is still saved locally to `localStorage` and shown in the **Orders** tab. Update the endpoint URL in `completeOrder()` inside `src/App.tsx` to point to your server.

---

## 🤖 AI Stylist — Keyword Guide

The AI Stylist matches keywords in your message to recommend curated looks. Try phrases containing:

| Keyword(s)                                  | Curated Theme        |
| ------------------------------------------- | -------------------- |
| `wedding`, `bride`, `ceremony`              | 💍 Wedding guest      |
| `date`, `romantic`, `dinner`                | ❤️ Date night         |
| `casual`, `everyday`, `weekend`             | ☕ Casual chic        |
| `office`, `work`, `professional`            | 💼 Office / Workwear  |
| `winter`, `cold`, `coat`                    | ❄️ Winter / Outerwear |
| `summer`, `beach`, `vacation`               | ☀️ Summer / Vacation  |
| `formal`, `gala`, `event`                   | 🥂 Formal / Black-tie |
| `dress`, `jacket`, `coat`                   | 👗 Category-specific  |

---

## 🎯 Usage Guide

1. **Browse** — Use search, categories, price slider, and sort to explore the collection.
2. **View a product** — Click **View Details** to choose size/color/quantity or use **Virtual Try-On**.
3. **Wishlist** — Tap the ♥ on any product to save it for later.
4. **Ask the AI Stylist** — Describe your occasion ("I need a wedding guest dress") and get curated picks you can add instantly.
5. **Find your size** — Open the **AI Size Advisor**, enter your measurements, and get a recommendation.
6. **Checkout** — Open the cart, proceed to checkout, pick a payment method, and place your order.
7. **Track orders** — Visit the **Orders** tab to review your purchase history.

---

## 🎨 Design System

| Token            | Value          | Usage                            |
| ---------------- | -------------- | -------------------------------- |
| Background       | `#FAF7F2`      | Warm cream page background       |
| Ink / Text       | `#1F2937`      | Headings, primary text, buttons  |
| Accent           | `#9F1239`      | Wine accent, highlights, badges  |
| Accent Deep      | `#7C2D12`      | Gradient & hover states          |
| Sand / Gold      | `#E5D4B9`      | Hero subtext on dark sections    |
| Border           | `#E5E0D5`      | Cards & dividers                 |

**Typography:** Serif display headings + clean sans-serif body text for a refined editorial feel.

---
---

## 🛣️ Roadmap

- [ ] Real authentication & user accounts
- [ ] Live inventory & real payment gateway (Stripe / Razorpay)
- [ ] True AI try-on with garment transfer
- [ ] Product reviews & ratings
- [ ] Multi-language & currency support
- [ ] PWA / offline support

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

**GLAMORA** — *Paris · Milan · New York*

Built with 💜 for the modern woman.

© 2014–2026 Glamora. All Rights Reserved.

</div>
