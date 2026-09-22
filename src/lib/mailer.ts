import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface OrderItem {
  title: string;
  price: string;
  quantity: number;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerLastName?: string;
  customerEmail: string;
  customerPhone: string;
  customerPhone2?: string;
  address: string;
  landmark?: string;
  postalCode?: string;
  items: OrderItem[];
  totalAmount: string;
  deliveryFee: string;
  paymentMethod?: string;
}

export async function sendOrderNotificationEmail(order: OrderEmailData) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #fde8fc;">${item.title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #fde8fc;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #fde8fc;text-align:right;">Rs. ${Number(item.price).toLocaleString()}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #fde8fc;text-align:right;">Rs. ${(Number(item.price) * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const fullName = [order.customerName, order.customerLastName].filter(Boolean).join(" ") || "—";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#fcb8fd;padding:28px 32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:1px;">ðŸ›ï¸ New Order Received!</h1>
      <p style="color:#fde8fc;margin:6px 0 0;font-size:13px;">Order ID: <strong>#${order.orderId.slice(-8).toUpperCase()}</strong></p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">

      <!-- Customer Info -->
      <h2 style="color:#fcb8fd;font-size:15px;margin:0 0 12px;border-bottom:2px solid #fde8fc;padding-bottom:6px;">Customer Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
<tr><td style="padding:5px 0;color:#888;font-size:13px;width:130px;">Name</td><td style="padding:5px 0;font-size:13px;font-weight:bold;">${fullName}</td></tr>
        <tr><td style="padding:5px 0;color:#888;font-size:13px;">Email</td><td style="padding:5px 0;font-size:13px;">${order.customerEmail}</td></tr>
        <tr><td style="padding:5px 0;color:#888;font-size:13px;">Phone</td><td style="padding:5px 0;font-size:13px;">${order.customerPhone}${order.customerPhone2 ? ", " + order.customerPhone2 : ""}</td></tr>
        <tr><td style="padding:5px 0;color:#888;font-size:13px;">Address</td><td style="padding:5px 0;font-size:13px;">${order.address}${order.landmark ? ", " + order.landmark : ""}${order.postalCode ? " - " + order.postalCode : ""}</td></tr>
        <tr><td style="padding:5px 0;color:#888;font-size:13px;">Payment</td><td style="padding:5px 0;font-size:13px;">${order.paymentMethod || "COD"}</td></tr>
      </table>

      <!-- Order Items -->
      <h2 style="color:#fcb8fd;font-size:15px;margin:0 0 12px;border-bottom:2px solid #fde8fc;padding-bottom:6px;">Order Items</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#fff5fe;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#fcb8fd;">Product</th>
            <th style="padding:8px 12px;text-align:center;font-size:12px;color:#fcb8fd;">Qty</th>
            <th style="padding:8px 12px;text-align:right;font-size:12px;color:#fcb8fd;">Price</th>
            <th style="padding:8px 12px;text-align:right;font-size:12px;color:#fcb8fd;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Totals -->
      <div style="background:#fff5fe;border-radius:8px;padding:16px 20px;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#888;">Delivery Fee</span>
          <span style="font-size:13px;">Rs. ${Number(order.deliveryFee || 0).toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid #fde8fc;padding-top:10px;margin-top:6px;">
          <span style="font-size:15px;font-weight:bold;color:#fcb8fd;">Total</span>
          <span style="font-size:15px;font-weight:bold;color:#fcb8fd;">Rs. ${Number(order.totalAmount).toLocaleString()}</span>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#fff5fe;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#aaa;">Arcure Pharma &nbsp;|&nbsp; arcurepharma3007@gmail.com</p>
      <p style="margin:4px 0 0;font-size:11px;color:#ccc;">This is an automated order notification</p>
    </div>

  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Arcure Pharma Orders" <${process.env.EMAIL_USER}>`,
    to: "arcurepharma3007@gmail.com",
    subject: `ðŸ›ï¸ New Order #${order.orderId.slice(-8).toUpperCase()} â€” Rs. ${Number(order.totalAmount).toLocaleString()}`,
    html,
  });
}



