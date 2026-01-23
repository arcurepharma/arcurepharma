# Arcure Pharma Storefront

A modern, fast, and professional wellness storefront built with React and optimized for Vercel deployment.

## ✨ Features

- **Automated Order Confirmations**: Serverless logic sends professional summaries via Namecheap Pro Email.
- **WhatsApp Integration**: Persistent floating chat button for direct customer support.
- **Shared Architecture**: Extracted reusable components (`GlassCard`, `HeroSection`, `FormInput`) for maintenance and speed.
- **Localization**: Native support for **PKR (Rs.)** with integrated shipping and tax logic.
- **Premium Design**: High-performance glassmorphism UI with unified background utilities.

## 🚀 Setup & Local Development

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Start Dev Server**:
    ```bash
    npm start
    ```

## 📦 Vercel Deployment

This project uses Vercel Serverless Functions (`/api/send-email.js`). To enable email confirmations, you must set the following **Environment Variables** in your Vercel Dashboard:

| Variable    | Description                      |
| :---------- | :------------------------------- |
| `SMTP_USER` | Your Namecheap Pro email address |
| `SMTP_PASS` | Your email password              |
| `SMTP_HOST` | `mail.privateemail.com`          |
| `SMTP_PORT` | `587`                            |

## 🛠️ Project Structure

- `/src/components/shared`: Reusable UI components.
- `/src/pages`: Main application screens (Home, Cart, Checkout, etc).
- `/src/dependencies`: Business logic, product data, and social links.
- `/api`: Vercel serverless function for email dispatch.

---

_Optimized and enhanced by Antigravity._
