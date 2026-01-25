const nodemailer = require("nodemailer");

const createTransporter = (user) => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.privateemail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: { user: user, pass: process.env.SMTP_PASS },
  });
};

const sendContactEmail = async (data, res) => {
  const { name, email, subject, message } = data;
  const supportEmail = process.env.SUPPORT_EMAIL;
  const transporter = createTransporter(supportEmail);

  try {
    await transporter.sendMail({
      from: `"Contact Form" <${supportEmail}>`,
      to: supportEmail,
      replyTo: email,
      subject: `New Message: ${subject} (${name})`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>New Contact Message</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>body{margin:0;padding:20px;background-color:#f5f5f5;font-family:'Inter',sans-serif}</style></head><body><div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:6px;overflow:hidden;border:1px solid #e2e8f0"><div style="background:#050616;padding:10px 15px;border-bottom:2px solid #d4fc79"><span style="color:#ffffff;font-weight:800;font-size:12px;letter-spacing:1px">ARCUREPHARMA - NEW INQUIRY</span></div><div style="padding:15px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:10px;font-size:13px"><tr><td style="color:#718096;width:60px;font-weight:600">SENDER:</td><td style="color:#1a202c;font-weight:600">${name} <span style="font-weight:400;opacity:0.7">&lt;${email}&gt;</span></td></tr><tr><td style="color:#718096;font-weight:600;padding-top:4px">SUBJECT:</td><td style="color:#1a202c;font-weight:600;padding-top:4px">${subject}</td></tr></table><div style="background:#f8fafc;border:1px solid #edf2f7;border-radius:4px;padding:12px;font-size:13px;color:#4a5568;line-height:1.4">${message.replace(/\n/g, '<br/>')}</div><div style="margin-top:12px;text-align:right"><a href="mailto:${email}?subject=Re: ${subject}" style="background:#1a1c4b;color:#ffffff;padding:8px 20px;border-radius:4px;text-decoration:none;font-weight:600;font-size:12px;display:inline-block">Reply</a></div></div></div></body></html>`
    });
    return res.status(200).json({ message: "Contact email sent successfully" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return res.status(500).json({ error: "Failed to send contact email" });
  }
};

const sendOrderEmail = async (data, res) => {
  const { customer_name, customer_email, customer_phone, customer_whatsapp, order_details, subtotal, shipping, tax, total_amount, shipping_address, order_id, social_links, order_time } = data;
  const orderEmail = process.env.ORDER_EMAIL;
  const transporter = createTransporter(orderEmail);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  
  // Extract dynamic support info from social_links passed from checkout
  const phoneVal = social_links?.find(l => l.name === "Phone")?.url?.replace("tel:", "") || "03341169999";
  const whatsappUrl = social_links?.find(l => l.name === "WhatsApp")?.url || `https://wa.me/${phoneVal.replace(/\s+/g, '')}`;

  // Fix address formatting: Move postal code to end with hyphen
  let formattedAddress = shipping_address;
  const addressParts = shipping_address.split(",").map(p => p.trim());
  if (addressParts.length >= 2) {
    const postalCode = addressParts[addressParts.length - 2];
    const country = addressParts[addressParts.length - 1];
    if (/^\d{5}$/.test(postalCode)) {
       formattedAddress = addressParts.slice(0, -2).join(", ") + `, ${country} - ${postalCode}`;
    }
  }

  const productRows = order_details.split("\n").map(line => {
    const [desc, price] = line.split(" — ");
    const qtyMatch = desc.match(/x\s*(\d+)$/);
    const productName = qtyMatch ? desc.replace(/x\s*\d+$/, "").trim() : desc;
    const qty = qtyMatch ? qtyMatch[1] : "1";
    return `<tr><td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; vertical-align: top;"><div style="color: #1a202c; font-size: 14px; font-weight: 700; margin-bottom: 4px;">${productName}</div><div style="color: #a0aec0; font-size: 12px; font-weight: 500;">QTY: ${qty}</div></td><td align="right" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; vertical-align: top; color: #2d3748; font-size: 14px; font-weight: 600;">${price}</td></tr>`;
  }).join("");

  const iconMap = {
    Facebook: "https://cdn-icons-png.flaticon.com/32/5968/5968764.png",
    Instagram: "https://cdn-icons-png.flaticon.com/32/3955/3955024.png",
    WhatsApp: "https://cdn-icons-png.flaticon.com/32/3670/3670051.png"
  };

  try {
    await transporter.sendMail({
      from: `"ArcurePharma" <${orderEmail}>`,
      to: customer_email,
      bcc: orderEmail,
      subject: `Your ArcurePharma Order is Confirmed! ${order_id ? `#${order_id}` : ""}`,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Order Confirmation</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>@media screen and (max-width:600px){.container{width:100%!important;padding:0!important}.content-padding{padding-left:20px!important;padding-right:20px!important}.hero-text{font-size:24px!important}.two-col,.col-50,.contact-grid td,.contact-col{display:block!important;width:100%!important;margin-bottom:15px!important}.contact-col { padding: 0 !important; }.support-card { padding: 20px !important; }}</style></head><body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f5f5;padding:40px 0;"><tr><td align="center"><table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);"><tr><td align="center" style="padding:0;background-color:#0e0f2c;"><div style="background:radial-gradient(circle at top right,#1a1c4b 0%,#0e0f2c 60%,#050616 100%);padding:40px 0;text-align:center;"><img src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png" width="180" alt="Delivery Truck" style="margin:0 auto;display:block;filter:brightness(0) invert(1);"><div style="color:#ffffff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-top:20px;">Secure Delivery</div></div></td></tr><tr><td class="content-padding" style="padding: 40px 40px 30px 40px;"><h1 class="hero-text" style="color: #1a202c; margin: 0 0 10px 0; font-size: 28px; font-weight: 700; line-height: 1.2;">Thanks for the order</h1><p style="color: #718096; font-size: 15px; margin: 0 0 30px 0; line-height: 1.5;">Hi <strong>${customer_name}</strong>, Your order is all set to hit the road. We're packing it up with care and it'll be on its way to you soon.</p><table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;"><tr><td align="center" width="25%" style="vertical-align: top;"><div style="width: 44px; height: 44px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;"><img src="https://cdn-icons-png.flaticon.com/128/190/190411.png" width="44" height="44" alt="Confirmed"></div><div style="color: #3b82f6; font-size: 13px; font-weight: 700; text-transform: uppercase;">Confirmed</div></td><td align="center" width="12%" style="vertical-align: top; padding-top: 22px;"><div style="border-top: 2px dashed #cbd5e0; width: 100%; height: 0;"></div></td><td align="center" width="25%" style="vertical-align: top;"><div style="width: 44px; height: 44px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;"><img src="https://cdn-icons-png.flaticon.com/128/713/713311.png" width="32" height="32" alt="Shipping" style="opacity: 0.5;"></div><div style="color: #718096; font-size: 13px; font-weight: 600; text-transform: uppercase;">Shipping</div></td><td align="center" width="12%" style="vertical-align: top; padding-top: 22px;"><div style="border-top: 2px dashed #cbd5e0; width: 100%; height: 0;"></div></td><td align="center" width="25%" style="vertical-align: top;"><div style="width: 44px; height: 44px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;"><img src="https://cdn-icons-png.flaticon.com/128/609/609803.png" width="32" height="32" alt="Delivered" style="opacity: 0.5;"></div><div style="color: #718096; font-size: 13px; font-weight: 600; text-transform: uppercase;">Delivered</div></td></tr></table><div style="background: #f7fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;"><h2 style="color: #2d3748; font-size: 16px; font-weight: 700; margin: 0 0 20px 0;">Order Summary</h2><table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;"><tr><td style="padding: 8px 0;"><div style="color: #a0aec0; font-size: 12px; margin-bottom: 4px;">Order number</div><div style="color: #2d3748; font-size: 14px; font-weight: 600;">#${order_id || 'PENDING'}</div></td><td align="right" style="padding: 8px 0;"><div style="color: #a0aec0; font-size: 12px; margin-bottom: 4px;">Date</div><div style="color: #2d3748; font-size: 14px; font-weight: 600;">${date} at ${order_time}</div></td></tr></table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">${productRows}</table><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="padding: 6px 0; color: #718096; font-size: 14px;">Subtotal</td><td align="right" style="padding: 6px 0; color: #2d3748; font-size: 14px; font-weight: 500;">${subtotal}</td></tr><tr><td style="padding: 6px 0; color: #718096; font-size: 14px;">Shipping</td><td align="right" style="padding: 6px 0; color: #48bb78; font-size: 14px; font-weight: 500;">${shipping === 'Rs. 0' ? 'FREE' : shipping}</td></tr><tr><td style="padding: 6px 0; color: #718096; font-size: 14px;">Tax</td><td align="right" style="padding: 6px 0; color: #2d3748; font-size: 14px; font-weight: 500;">${tax}</td></tr><tr><td style="padding: 20px 0 0 0; color: #1a202c; font-size: 16px; font-weight: 700; border-top: 2px solid #e2e8f0;">Total Amount</td><td align="right" style="padding: 20px 0 0 0; color: #1a202c; font-size: 20px; font-weight: 700; border-top: 2px solid #e2e8f0;">${total_amount}</td></tr></table></div><div style="background: #f7fafc; border-radius: 12px; padding: 24px; margin-bottom: 30px;"><h2 style="color: #2d3748; font-size: 16px; font-weight: 700; margin: 0 0 20px 0;">Customer Information</h2><table border="0" cellpadding="0" cellspacing="0" width="100%" class="two-col"><tr><td width="48%" class="col-50" valign="top" style="padding-right: 2%;"><div style="margin-bottom: 20px;"><div style="color: #a0aec0; font-size: 14px; margin-bottom: 8px; font-weight: 600;">Shipping address</div><div style="color: #4a5568; font-size: 14px; line-height: 1.6;">${customer_name}<br/>${formattedAddress.replace(/,/g, '<br/>')}</div></div><div style="margin-bottom: 20px;"><div style="color: #a0aec0; font-size: 14px; margin-bottom: 8px; font-weight: 600;">Phone number</div><div style="color: #4a5568; font-size: 14px;">${customer_phone}</div></div><div><div style="color: #a0aec0; font-size: 14px; margin-bottom: 8px; font-weight: 600;">Shipping method</div><div style="color: #4a5568; font-size: 14px;">Standard Shipping</div></div></td><td width="48%" class="col-50" valign="top" style="padding-left: 2%;"><div style="margin-bottom: 20px;"><div style="color: #a0aec0; font-size: 14px; margin-bottom: 8px; font-weight: 600;">Billing address</div><div style="color: #4a5568; font-size: 14px; line-height: 1.6;">${customer_name}<br/>${formattedAddress.replace(/,/g, '<br/>')}</div></div>${customer_whatsapp ? `<div style="margin-bottom: 20px;"><div style="color: #a0aec0; font-size: 14px; margin-bottom: 8px; font-weight: 600;">WhatsApp number</div><div style="color: #4a5568; font-size: 14px;">${customer_whatsapp}</div></div>` : ''}<div><div style="color: #a0aec0; font-size: 14px; margin-bottom: 8px; font-weight: 600;">Payment method</div><div style="color: #4a5568; font-size: 14px;">Cash on Delivery</div></div></td></tr></table></div><div style="background: #ffffff; border-radius: 12px; padding: 20px 0;"><h3 style="color: #1a202c; font-size: 18px; font-weight: 700; margin: 0 0 20px 0; text-align: center;">Problems with the Order?</h3><table border="0" cellpadding="0" cellspacing="0" width="100%" class="contact-grid"><tr><td class="contact-col" width="32%" style="vertical-align: top; padding-right: 1.5%;"><a href="mailto:${process.env.SUPPORT_EMAIL || 'support@arcurepharma.com'}" style="text-decoration: none; display: block; height: 100%;"><div class="support-card" style="background: #f8fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 15px; height: 100%; box-sizing: border-box;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="vertical-align: middle;"><div style="color: #718096; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">EMAIL</div></td><td width="24" style="vertical-align: middle; text-align: right;"><img src="https://cdn-icons-png.flaticon.com/64/732/732200.png" width="20" height="20" alt="Email"></td></tr></table></div></a></td><td class="contact-col" width="32%" style="vertical-align: top; padding: 0 0.75%;"><a href="tel:${phoneVal}" style="text-decoration: none; display: block; height: 100%;"><div class="support-card" style="background: #f8fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 15px; height: 100%; box-sizing: border-box;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="vertical-align: middle;"><div style="color: #718096; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">PHONE</div></td><td width="24" style="vertical-align: middle; text-align: right;"><img src="https://cdn-icons-png.flaticon.com/64/597/597177.png" width="20" height="20" alt="Phone"></td></tr></table></div></a></td><td class="contact-col" width="32%" style="vertical-align: top; padding-left: 1.5%;"><a href="${whatsappUrl}" style="text-decoration: none; display: block; height: 100%;"><div class="support-card" style="background: #f8fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 15px; height: 100%; box-sizing: border-box;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="vertical-align: middle;"><div style="color: #718096; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">WHATSAPP</div></td><td width="24" style="vertical-align: middle; text-align: right;"><img src="https://cdn-icons-png.flaticon.com/64/3670/3670051.png" width="20" height="20" alt="WhatsApp"></td></tr></table></div></a></td></tr></table></div></td></tr><tr><td align="center" style="padding:30px 40px;background:#1a1c4b;border-top:1px solid #2d3748;"><div style="margin-bottom:10px;">${social_links?.map(link => {const iconUrl = iconMap[link.name];return iconUrl ? `<a href="${link.url}" style="text-decoration:none;margin:0 8px;display:inline-block;"><img src="${iconUrl}" width="24" height="24" alt="${link.name}"></a>` : "";}).join("")}</div><div style="margin-top:10px;"><a href="https://arcurepharma.com" style="text-decoration:none;"><strong style="color:#ffffff;font-size:14px;font-weight:700;letter-spacing:0.5px;">ARCUREPHARMA</strong></a></div><p style="color:#cbd5e0;font-size:11px;margin:15px 0 0 0;">© ArcurePharma. All right reserved &nbsp;|&nbsp; <a href="#" style="color:#a0aec0;text-decoration:none;">Help center</a> &nbsp;|&nbsp; <a href="#" style="color:#a0aec0;text-decoration:none;">Privacy policy</a></p></td></tr></table></td></tr></table></body></html>`,
    });

    return res.status(200).json({ message: "Order confirmation email sent successfully" });
  } catch (error) {
    console.error("Error sending order email:", error);
    return res.status(500).json({ error: "Failed to send order email" });
  }
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, ...data } = req.body;

  if (type === "contact") {
    return await sendContactEmail(data, res);
  } else {
    return await sendOrderEmail(data, res);
  }
};
