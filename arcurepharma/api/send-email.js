const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { customer_name, customer_email, order_details, subtotal, shipping, tax, total_amount, shipping_address, order_id, social_links, order_time } = req.body;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const whatsappUrl = social_links?.find(l => l.name === "WhatsApp")?.url || "https://wa.me/";

  const iconMap = {
    "Facebook": "https://cdn-icons-png.flaticon.com/32/733/733547.png",
    "Instagram": "https://cdn-icons-png.flaticon.com/32/2111/2111463.png",
    "Twitter": "https://cdn-icons-png.flaticon.com/32/5969/5969020.png",
    "WhatsApp": "https://cdn-icons-png.flaticon.com/32/733/733585.png",
  };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.privateemail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const formattedItems = order_details
    .split("\n")
    .map(line => {
        const [desc, price] = line.split(" — ");
        return `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #e5e7eb; font-size: 14px; font-weight: 500;">${desc}</td>
                <td align="right" style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #ffffff; font-size: 14px; font-weight: 700;">${price}</td>
            </tr>
        `;
    })
    .join("");

  try {
    const mailOptions = {
      from: `"ArcurePharma" <${process.env.SMTP_USER}>`,
      to: customer_email,
      subject: `Your ArcurePharma Order is Confirmed! ${order_id ? `#${order_id}` : ""}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @media screen and (max-width: 600px) {
              .container { width: 100% !important; border-radius: 0 !important; border: none !important; }
              .content-padding { padding-left: 20px !important; padding-right: 20px !important; }
              .hero-text { font-size: 28px !important; }
              .info-bar td { display: block !important; width: 100% !important; padding: 12px 0 !important; border: none !important; text-align: left !important; }
              .info-bar { border-radius: 12px !important; padding: 15px !important; }
              .summary-card { padding: 15px !important; border-radius: 16px !important; }
              .address-row td { display: block !important; width: 100% !important; margin-bottom: 15px !important; }
              .footer { padding: 30px 20px !important; }
              .price-total { font-size: 24px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #050616; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050616;">
            <tr>
              <td align="center" style="padding: 30px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background: #0e0f2c; background: linear-gradient(180deg, #1a1c4b 0%, #0e0f2c 100%); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 36px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.6);">
                  
                  <tr>
                    <td style="height: 4px; background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);"></td>
                  </tr>

                  <!-- Hero Header -->
                  <tr>
                    <td align="center" class="content-padding" style="padding: 50px 40px 40px 40px; position: relative;">
                      <div style="background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%); width: 300px; height: 300px; position: absolute; top: -100px; left: 50%; transform: translateX(-50%); z-index: 0;"></div>
                      <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); width: 70px; height: 70px; border-radius: 20px; display: inline-block; text-align: center; margin-bottom: 25px; box-shadow: 0 15px 35px rgba(79, 70, 229, 0.3); z-index: 1; position: relative;">
                        <span style="font-size: 32px; line-height: 70px;">✨</span>
                      </div>
                      <h1 class="hero-text" style="color: #ffffff; margin: 0; font-size: 34px; font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; z-index: 1; position: relative;">Order <span style="background: linear-gradient(90deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: #6366f1;">Confirmed</span></h1>
                      <p style="color: rgba(255,255,255,0.7); font-size: 16px; margin: 15px 0 0 0; font-weight: 500; z-index: 1; position: relative;">Hi ${customer_name.split(' ')[0]}, your wellness journey is our priority.</p>
                    </td>
                  </tr>

                  <!-- Order Info Bar -->
                  <tr>
                    <td class="content-padding" style="padding: 0 40px;">
                       <table border="0" cellpadding="0" cellspacing="0" width="100%" class="info-bar" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 20px;">
                          <tr>
                             <td align="left">
                                <div style="color: rgba(255,255,255,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 4px;">Order ID</div>
                                <div style="color: #ffffff; font-size: 13px; font-weight: 700;">#${order_id || 'PENDING'}</div>
                             </td>
                             <td align="center" style="border-left: 1px solid rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.1);">
                                <div style="color: rgba(255,255,255,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 4px;">Placed On</div>
                                <div style="color: #ffffff; font-size: 13px; font-weight: 700;">${date}</div>
                             </td>
                             <td align="right">
                                <div style="color: rgba(255,255,255,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 4px;">Time</div>
                                <div style="color: #ffffff; font-size: 13px; font-weight: 700;">${order_time || '--:--'}</div>
                             </td>
                          </tr>
                       </table>
                    </td>
                  </tr>

                  <!-- Main Receipt -->
                  <tr>
                    <td class="content-padding" style="padding: 30px 40px 20px 40px;">
                      <h3 style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0 0 20px 0;">Summary <span style="margin-left: 10px; background: rgba(99, 102, 241, 0.2); color: #6366f1; padding: 4px 12px; border-radius: 8px; font-size: 12px;">Invoice</span></h3>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="summary-card" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 25px;">
                        <tr>
                          <td>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              ${formattedItems}
                            </table>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px; padding-top: 20px; border-top: 1px dashed rgba(255,255,255,0.2);">
                              <tr>
                                <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 6px 0;">Subtotal</td>
                                <td align="right" style="color: #ffffff; font-size: 14px; padding: 6px 0; font-weight: 600;">${subtotal}</td>
                              </tr>
                              <tr>
                                <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 6px 0;">Shipping</td>
                                <td align="right" style="color: #10b981; font-size: 14px; padding: 6px 0; font-weight: 600;">${shipping === 'Rs. 0' ? 'FREE' : shipping}</td>
                              </tr>
                              <tr>
                                <td style="color: rgba(255,255,255,0.6); font-size: 14px; padding: 6px 0;">GST / Tax</td>
                                <td align="right" style="color: #ffffff; font-size: 14px; padding: 6px 0; font-weight: 600;">${tax}</td>
                              </tr>
                              <tr>
                                <td style="color: #ffffff; font-size: 18px; font-weight: 800; padding: 25px 0 0 0;">Total Amount</td>
                                <td align="right" class="price-total" style="color: #6366f1; font-size: 28px; font-weight: 900; padding: 25px 0 0 0; letter-spacing: -1px;">${total_amount}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Address & Timeline row class -->
                  <tr>
                    <td class="content-padding" style="padding: 10px 40px 30px 40px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="address-row">
                        <tr>
                           <td width="48%" valign="top" style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 20px;">
                               <div style="color: rgba(255,255,255,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 12px;">Ship To</div>
                               <div style="color: #ffffff; font-size: 14px; line-height: 1.6; font-weight: 600;">
                                 <span style="color: #6366f1;">${customer_name}</span><br/>
                                 <span style="font-weight: 400; color: rgba(255,255,255,0.7);">${shipping_address}</span>
                               </div>
                           </td>
                           <td width="4%"></td>
                           <td width="48%" valign="top" style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 20px; padding: 20px;">
                               <div style="color: rgba(99, 102, 241, 1); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 15px;">Next Steps</div>
                               <div style="color: #ffffff; font-size: 13px; line-height: 1.4;">
                                 <div style="margin-bottom: 10px;">✅ Confirmed</div>
                                 <div style="opacity: 0.6;">📦 Processing</div>
                               </div>
                           </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Concierge -->
                  <tr>
                    <td class="content-padding" style="padding: 0 40px 30px 40px;">
                       <a href="${whatsappUrl}" style="text-decoration: none; display: block;">
                         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 24px; padding: 20px;">
                            <tr>
                              <td style="padding-left: 5px;">
                                 <div style="color: #ffffff; font-size: 15px; font-weight: 800; margin-bottom: 2px;">Wellness Concierge</div>
                                 <div style="color: rgba(255,255,255,0.6); font-size: 12px;">Need help? Chat with our experts.</div>
                              </td>
                              <td align="right">
                                 <img src="https://cdn-icons-png.flaticon.com/32/733/733585.png" width="28" height="28" alt="WhatsApp" style="opacity: 0.9;">
                              </td>
                            </tr>
                         </table>
                       </a>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" class="footer" style="padding: 50px 40px 40px 40px; background: rgba(0,0,0,0.5); border-top: 1px solid rgba(255,255,255,0.1);">
                       <div style="margin-bottom: 25px; letter-spacing: 3px; font-weight: 900; color: #ffffff; font-size: 18px;">ARCURE<span style="color: #6366f1;">PHARMA</span></div>
                       
                       <div style="margin-bottom: 30px;">
                          ${social_links?.map(link => {
                            const iconUrl = iconMap[link.name];
                            return iconUrl ? `
                              <a href="${link.url}" style="text-decoration: none; margin: 0 12px; display: inline-block;">
                                <img src="${iconUrl}" width="22" height="22" alt="${link.name}" style="opacity: 0.8;">
                              </a>
                            ` : "";
                          }).join("")}
                       </div>
                       
                       <p style="color: rgba(255,255,255,0.5); font-size: 12px; line-height: 1.6; margin: 0; max-width: 400px;">
                        &copy; 2026 Arcure Pharma PVT LTD.<br/>
                        Pharmaceutical Excellence & Wellness.
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
