# ⚡ WhatsApp Chatbot - Quick Start

## 🎯 In 2 Minutes

### **Step 1: Start Server**
```bash
npm run dev
```
Server runs at: http://localhost:3000

### **Step 2: Initialize WhatsApp**
```bash
# Open new terminal
curl -X POST http://localhost:3000/api/whatsapp/connect
```

You'll see **QR code in terminal** → Scan with WhatsApp → Done ✅

### **Step 3: Test Widget**
1. Open http://localhost:3000
2. Look for **green WhatsApp button** (bottom-right)
3. Click to open chat
4. Type: "Hello"
5. Bot replies instantly! 🤖

---

## 📱 Test User Flow

### **Scenario 1: Customer Asks About Product**
```
Customer: "What is ARCUDERM?"
Bot: "ARCUDERM CS Serum - Rs. 2,999
      Benefits: Anti-aging, Hydrating
      How to use: Apply morning & night"
Customer: "Shift to WhatsApp"
Bot: Takes conversation to WhatsApp ✅
```

### **Scenario 2: Order Tracking**
```
Customer: "Track my order"
Bot: "Please provide Order ID or Email
      Our team will help with updates"
Customer: [Provides info]
Admin: [Views in dashboard, sends update]
```

### **Scenario 3: Payment Question**
```
Customer: "How to pay?"
Bot: "💳 Payment Options:
      ✅ Cash on Delivery
      ✅ JazzCash/EasyPaisa
      ✅ Credit Card"
```

---

## 👨‍💼 Admin Testing

### **View All Conversations**
1. Go to: http://localhost:3000/admin/conversations
2. See list of all customer chats
3. Click any conversation
4. See full message history
5. Send reply or shift to WhatsApp

### **Quick Actions**
- **Filter**: Active, Completed, Transferred
- **Reply**: Type message → Send button
- **Shift**: "Shift to WhatsApp" button → Moves to owner's WhatsApp

---

## 🧪 API Testing (For Developers)

### **Test Send Message**
```bash
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "923001234567",
    "message": "Test from Arcure!",
    "sessionId": "test-123"
  }'
```

### **Test Chat Bot**
```bash
curl -X POST http://localhost:3000/api/whatsapp/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "userMessage": "Hello, what products do you have?"
  }'
```

### **Get Chat History**
```bash
curl http://localhost:3000/api/whatsapp/chat?sessionId=test-123
```

### **View All Conversations**
```bash
curl http://localhost:3000/api/whatsapp/conversations?status=Active
```

---

## 📊 Database Check

### **View Conversations in Database**
```bash
npm run db:studio
# Open Drizzle Studio UI
# Navigate to chat_history table
```

---

## 🎮 Feature Checklist

| Feature | Status | Test |
|---------|--------|------|
| Widget displays | ✅ | Visit homepage |
| Chat with bot | ✅ | Type "hello" |
| Message history | ✅ | Refresh page |
| Shift to WhatsApp | ✅ | Click WhatsApp button |
| Admin dashboard | ✅ | Visit /admin/conversations |
| Send WhatsApp | ✅ | Use API |
| Database storage | ✅ | Check db:studio |

---

## 🔧 Troubleshooting

### **Widget Not Showing?**
```
1. Check: npm run dev is running
2. Hard refresh: Ctrl+Shift+R
3. Check Console: F12 → Console tab
```

### **Chat Not Responding?**
```
1. Check server logs for errors
2. Verify API: curl http://localhost:3000/api/whatsapp/chat
3. Check database connection
```

### **Can't Shift to WhatsApp?**
```
1. Verify owner number in .env
2. Check WhatsApp is connected: POST /api/whatsapp/connect
3. See server logs for auth issues
```

### **QR Code Not Appearing?**
```
1. Check terminal output carefully
2. Run: curl -X POST http://localhost:3000/api/whatsapp/connect
3. Look in .next/dev/logs/next-development.log
```

---

## 📞 Example Conversations

### **Test These Messages**

```
1. "Assalam o Alaikum"       → Greeting response
2. "Products"                 → Product list
3. "ARCUDERM"                → Product details
4. "Price"                    → Payment options
5. "Track order"             → Tracking help
6. "Prescription"            → Prescription info
7. "Help"                    → Support options
8. "I want to chat on WhatsApp" → Shift to WhatsApp
```

---

## 🚀 Commands Reference

```bash
# Start server
npm run dev

# Seed database
npm run db:seed

# Check database
npm run db:studio

# Generate migrations
npm run db:generate

# Push migrations
npm run db:push

# Connect WhatsApp
curl -X POST http://localhost:3000/api/whatsapp/connect
```

---

## 📍 Key Files

| File | Purpose |
|------|---------|
| `src/lib/whatsapp.ts` | Baileys WhatsApp service |
| `src/components/storefront/WhatsAppWidget.tsx` | Floating widget UI |
| `src/app/api/whatsapp/chat/route.ts` | Chatbot logic |
| `src/app/admin/conversations/page.tsx` | Admin dashboard |
| `.env` | Configuration (owner number, auth path) |

---

## ✨ What's New

- ✅ Floating WhatsApp widget on homepage
- ✅ AI chatbot with product info, orders, payments
- ✅ Real-time message streaming
- ✅ Admin conversation dashboard
- ✅ One-click shift to WhatsApp
- ✅ Full message history storage
- ✅ Session-based tracking
- ✅ Keyword-based intelligent responses

---

## 🎉 You're All Set!

1. Start: `npm run dev`
2. Connect WhatsApp: `POST /api/whatsapp/connect`
3. Test: http://localhost:3000
4. Manage: http://localhost:3000/admin/conversations

**Happy chatting! 🚀**
