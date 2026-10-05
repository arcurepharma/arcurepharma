import nodemailer from "nodemailer";

function getTransporter() {
  const user = (process.env.EMAIL_USER || "arcurepharma3007@gmail.com").trim();
  const rawPass = process.env.EMAIL_PASS || "jyyp ipwj mwrd pime";
  const pass = rawPass.replace(/\s+/g, "");

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export interface OrderItem {
  title: string;
  price: string;
  quantity: number;
}

export interface OrderEmailData {
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

export async function sendOrderNotificationEmail(order: OrderEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("EMAIL_USER or EMAIL_PASS not configured in environment variables. Email notification skipped.");
    return false;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #dcfce7;font-size:13px;color:#1f2937;">${item.title}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #dcfce7;text-align:center;font-size:13px;color:#1f2937;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #dcfce7;text-align:right;font-size:13px;color:#1f2937;">Rs. ${Number(item.price).toLocaleString()}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #dcfce7;text-align:right;font-size:13px;font-weight:bold;color:#1f2937;">Rs. ${(Number(item.price) * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const fullName = [order.customerName, order.customerLastName].filter(Boolean).join(" ") || "—";
  const shortOrderId = order.orderId.slice(-8).toUpperCase();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || "arcurepharma3007@gmail.com";
  const senderEmail = process.env.EMAIL_USER?.trim() || "arcurepharma3007@gmail.com";

  // Admin Notification Email HTML
  const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e5e7eb;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg, #15803d 0%, #16a34a 100%);padding:32px 28px;text-align:center;">
      <span style="display:inline-block;padding:4px 12px;background:rgba(255,255,255,0.2);color:#ffffff;border-radius:20px;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">New Order Alert</span>
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Order Received!</h1>
      <p style="color:#dcfce7;margin:8px 0 0;font-size:14px;font-weight:500;">Order ID: <strong>#${shortOrderId}</strong></p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">

      <!-- Customer Info -->
      <h2 style="color:#16a34a;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;border-bottom:2px solid #dcfce7;padding-bottom:6px;font-weight:700;">Customer Information</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:120px;">Name</td><td style="padding:6px 0;font-size:13px;font-weight:bold;color:#111827;">${fullName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Phone</td><td style="padding:6px 0;font-size:13px;font-weight:bold;color:#16a34a;">${order.customerPhone}${order.customerPhone2 ? " / " + order.customerPhone2 : ""}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td><td style="padding:6px 0;font-size:13px;color:#111827;">${order.customerEmail || "N/A"}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Delivery Address</td><td style="padding:6px 0;font-size:13px;color:#111827;">${order.address}${order.landmark ? ", " + order.landmark : ""}${order.postalCode ? " (" + order.postalCode + ")" : ""}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Payment Method</td><td style="padding:6px 0;font-size:13px;font-weight:bold;color:#111827;">${order.paymentMethod || "Cash on Delivery (COD)"}</td></tr>
      </table>

      <!-- Order Items -->
      <h2 style="color:#16a34a;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;border-bottom:2px solid #dcfce7;padding-bottom:6px;font-weight:700;">Order Items</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#f0fdf4;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#15803d;font-weight:700;">Product</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#15803d;font-weight:700;">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#15803d;font-weight:700;">Price</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#15803d;font-weight:700;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Totals Summary -->
      <div style="background:#f0fdf4;border-radius:12px;padding:16px 20px;margin-bottom:20px;border:1px solid #dcfce7;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#4b5563;">Delivery Fee</span>
          <span style="font-size:13px;color:#111827;font-weight:600;">Rs. ${Number(order.deliveryFee || 0).toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid #bbf7d0;padding-top:10px;margin-top:6px;">
          <span style="font-size:16px;font-weight:bold;color:#15803d;">Grand Total</span>
          <span style="font-size:16px;font-weight:bold;color:#15803d;">Rs. ${Number(order.totalAmount).toLocaleString()}</span>
        </div>
      </div>

      <!-- Quick Action -->
      <div style="text-align:center;padding:12px 0;">
        <a href="https://www.arcurepharma.com/admin/orders/${order.orderId}" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:bold;">View Order in Admin Portal &rarr;</a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Arcure Pharma &bull; Automated E-Commerce Order Notification</p>
    </div>

  </div>
</body>
</html>`;

  try {
    const info = await transporter.sendMail({
      from: `"Arcure Pharma Orders" <${senderEmail}>`,
      to: adminEmail,
      subject: `🛒 New Order #${shortOrderId} — Rs. ${Number(order.totalAmount).toLocaleString()} (${fullName})`,
      html: adminHtml,
    });
    console.log("Admin order notification email sent successfully! ID:", info.messageId);
  } catch (err) {
    console.error("Failed to send admin order notification email:", err);
    throw err;
  }

  // Also send customer order confirmation receipt if customer provided email
  if (order.customerEmail && order.customerEmail.includes("@") && order.customerEmail.toLowerCase() !== adminEmail.toLowerCase()) {
    try {
      const customerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e5e7eb;">
    <div style="background:linear-gradient(135deg, #15803d 0%, #16a34a 100%);padding:32px 28px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;">Thank You for Your Order!</h1>
      <p style="color:#dcfce7;margin:8px 0 0;font-size:14px;">Your order has been received and is being processed.</p>
      <p style="color:#ffffff;margin:6px 0 0;font-size:13px;font-weight:bold;">Order ID: #${shortOrderId}</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#374151;font-size:14px;line-height:1.6;margin-top:0;">Dear <strong>${fullName}</strong>,</p>
      <p style="color:#374151;font-size:14px;line-height:1.6;">Thank you for shopping with <strong>Arcure Pharma</strong>. We are preparing your package and will notify you when it ships.</p>

      <h2 style="color:#16a34a;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:24px 0 12px;border-bottom:2px solid #dcfce7;padding-bottom:6px;font-weight:700;">Order Summary</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#f0fdf4;">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#15803d;">Product</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#15803d;">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#15803d;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(i => `
            <tr>
              <td style="padding:10px 12px;border-bottom:1px solid #dcfce7;font-size:13px;">${i.title}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #dcfce7;text-align:center;font-size:13px;">${i.quantity}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #dcfce7;text-align:right;font-size:13px;font-weight:bold;">Rs. ${(Number(i.price) * i.quantity).toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div style="background:#f0fdf4;border-radius:12px;padding:16px 20px;margin-bottom:20px;border:1px solid #dcfce7;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#4b5563;">Delivery Fee</span>
          <span style="font-size:13px;color:#111827;font-weight:600;">Rs. ${Number(order.deliveryFee || 0).toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid #bbf7d0;padding-top:10px;margin-top:6px;">
          <span style="font-size:16px;font-weight:bold;color:#15803d;">Total</span>
          <span style="font-size:16px;font-weight:bold;color:#15803d;">Rs. ${Number(order.totalAmount).toLocaleString()}</span>
        </div>
      </div>

      <p style="color:#6b7280;font-size:12px;line-height:1.5;"><strong>Delivery Address:</strong> ${order.address}${order.landmark ? ", " + order.landmark : ""}</p>
      <p style="color:#6b7280;font-size:12px;line-height:1.5;"><strong>Payment:</strong> ${order.paymentMethod || "Cash on Delivery"}</p>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Arcure Pharma &bull; WhatsApp Support: +92 330 5115999</p>
    </div>
  </div>
</body>
</html>`;

      await transporter.sendMail({
        from: `"Arcure Pharma" <${senderEmail}>`,
        to: order.customerEmail,
        subject: `Your Arcure Pharma Order is Confirmed! (#${shortOrderId})`,
        html: customerHtml,
      });
      console.log("Customer order receipt email sent to:", order.customerEmail);
    } catch (custErr) {
      console.warn("Customer receipt email warning:", custErr);
    }
  }

  return true;
}
