const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { customer_name, customer_email, order_details, subtotal, shipping, tax, total_amount, shipping_address, order_id, social_links } = req.body;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Extract WhatsApp URL safely from provided links
  const whatsappUrl = social_links?.find(l => l.name === "WhatsApp")?.url || "https://wa.me/";

  // Social Icon Mapping (Stable CDNs used for email compatibility)
  const iconMap = {
    "Facebook": "https://cdn-icons-png.flaticon.com/32/733/733547.png",
    "Instagram": "https://cdn-icons-png.flaticon.com/32/2111/2111463.png",
    "Twitter": "https://cdn-icons-png.flaticon.com/32/5969/5969020.png",
    "WhatsApp": "https://cdn-icons-png.flaticon.com/32/733/733585.png",
  };

  // Create transporter using Namecheap Pro Email (PrivateEmail) SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.privateemail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Format order details string into HTML rows: Name/Qty on left, Price on right
  const formattedItems = order_details
    .split("\n")
    .map(line => {
        const [desc, price] = line.split(" — ");
        return `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #ffffff; font-size: 14px; font-weight: 500;">${desc}</td>
                <td align="right" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #ffffff; font-size: 14px; font-weight: 700;">${price}</td>
            </tr>
        `;
    })
    .join("");

  try {
    const mailOptions = {
      from: `"Arcure Pharma" <${process.env.SMTP_USER}>`,
      to: customer_email,
      subject: `Order Confirmation - ${customer_name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #050616; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050616;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background: radial-gradient(circle at top right, #1a1c4b 0%, #0e0f2c 60%, #050616 100%); border: 1px solid rgba(255,255,255,0.05); border-radius: 28px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.5);">
                  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding: 50px 40px 30px 40px;">
                      <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); width: 70px; height: 70px; border-radius: 20px; display: inline-block; text-align: center; margin-bottom: 25px; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);">
                        <span style="font-size: 35px; line-height: 70px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));">📦</span>
                      </div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px; line-height: 1.2;">Order <span style="background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%); -webkit-background-clip: text; color: #6366f1;">Confirmed</span></h1>
                      <p style="color: rgba(255,255,255,0.6); font-size: 16px; margin: 15px 0 0 0; font-weight: 500;">Hi ${customer_name}, your premium selection is being prepared.</p>
                    </td>
                  </tr>

                  <!-- Order Details Card -->
                  <tr>
                    <td style="padding: 0 40px 20px 40px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 30px; backdrop-filter: blur(10px);">
                        <tr>
                          <td>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td style="color: rgba(255,255,255,0.4); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">Receipt Summary</td>
                                <td align="right" style="color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 600;">#${Math.floor(1000 + Math.random() * 9000)} • ${date}</td>
                              </tr>
                            </table>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px;">
                              ${formattedItems}
                            </table>

                            <!-- Detailed Breakdown -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1);">
                              <tr>
                                <td style="color: rgba(255,255,255,0.5); font-size: 14px; padding: 5px 0;">Subtotal</td>
                                <td align="right" style="color: #ffffff; font-size: 14px; padding: 5px 0; font-weight: 500;">${subtotal}</td>
                              </tr>
                              <tr>
                                <td style="color: rgba(255,255,255,0.5); font-size: 14px; padding: 5px 0;">Shipping</td>
                                <td align="right" style="color: #ffffff; font-size: 14px; padding: 5px 0; font-weight: 500;">${shipping}</td>
                              </tr>
                              <tr>
                                <td style="color: rgba(255,255,255,0.5); font-size: 14px; padding: 5px 0;">GST / Tax</td>
                                <td align="right" style="color: #ffffff; font-size: 14px; padding: 5px 0; font-weight: 500;">${tax}</td>
                              </tr>
                              <tr style="margin-top: 15px;">
                                <td style="color: #ffffff; font-size: 18px; font-weight: 800; padding: 20px 0 0 0;">Total Amount</td>
                                <td align="right" style="color: #6366f1; font-size: 24px; font-weight: 900; padding: 20px 0 0 0;">${total_amount}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Shipping Info -->
                  <tr>
                    <td style="padding: 10px 40px 30px 40px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 25px;">
                        <tr>
                          <td>
                             <div style="color: rgba(255,255,255,0.4); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 12px;">Delivery Address</div>
                             <div style="color: #ffffff; font-size: 15px; line-height: 1.6; font-weight: 500;">
                               <span style="color: #6366f1;">${customer_name}</span><br/>
                               ${shipping_address}
                             </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- WhatsApp & Support -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                       <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, rgba(37, 211, 102, 0.1) 0%, rgba(18, 140, 126, 0.1) 100%); border: 1px solid rgba(37, 211, 102, 0.2); border-radius: 20px; padding: 20px;">
                          <tr>
                            <td width="50" align="center">
                               <div style="background: #25d366; width: 40px; height: 40px; border-radius: 10px; text-align: center;">
                                  <span style="font-size: 20px; line-height: 40px;">💬</span>
                               </div>
                            </td>
                            <td style="padding-left: 15px;">
                               <div style="color: #ffffff; font-size: 15px; font-weight: 700;">WhatsApp Support</div>
                               <div style="color: rgba(255,255,255,0.6); font-size: 13px;">Chat with our experts for any assistance.</div>
                            </td>
                            <td align="right">
                               <a href="${whatsappUrl}" style="background: #25d366; color: #ffffff; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none;">Chat Now</a>
                            </td>
                          </tr>
                       </table>
                    </td>
                  </tr>

                  <!-- Footer / Socials -->
                  <tr>
                    <td align="center" style="padding: 40px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05);">
                       <div style="margin-bottom: 25px;">
                          ${social_links?.map(link => {
                            const iconUrl = iconMap[link.name];
                            return iconUrl ? `
                              <a href="${link.url}" style="text-decoration: none; margin: 0 12px; display: inline-block;">
                                <img src="${iconUrl}" width="24" height="24" alt="${link.name}" style="display: block; opacity: 0.8; filter: drop-shadow(0 0 5px rgba(99, 102, 241, 0.4));">
                              </a>
                            ` : "";
                          }).join("")}
                       </div>
                       
                       <p style="color: rgba(255,255,255,0.4); font-size: 13px; line-height: 1.6; margin: 0;">
                        Our team will verify your order via phone shortly before shipping your premium selection.<br/>
                        &copy; 2026 Arcure Pharma. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
