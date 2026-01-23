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

  // Extract WhatsApp URL safely from provided links
  const whatsappUrl = social_links?.find(l => l.name === "WhatsApp")?.url || "https://wa.me/";

  // Social Icon Mapping
  const iconMap = {
    "Facebook": "https://cdn-icons-png.flaticon.com/32/733/733547.png",
    "Instagram": "https://cdn-icons-png.flaticon.com/32/2111/2111463.png",
    "Twitter": "https://cdn-icons-png.flaticon.com/32/5969/5969020.png",
    "WhatsApp": "https://cdn-icons-png.flaticon.com/32/733/733585.png",
  };

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.privateemail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Format order details string into HTML rows
  const formattedItems = order_details
    .split("\n")
    .map(line => {
        const [desc, price] = line.split(" — ");
        return `
            <tr>
                <td style="padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.03); color: #e5e7eb; font-size: 14px; font-weight: 500;">${desc}</td>
                <td align="right" style="padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.03); color: #ffffff; font-size: 14px; font-weight: 700;">${price}</td>
            </tr>
        `;
    })
    .join("");

  try {
    const mailOptions = {
      from: `"Arcure Pharma" <${process.env.SMTP_USER}>`,
      to: customer_email,
      subject: `Your Arcure Pharma Order is Confirmed! ${order_id ? `#${order_id}` : ""}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; background-color: #02030d; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #02030d;">
            <tr>
              <td align="center" style="padding: 50px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background: #0a0c1f; background: linear-gradient(180deg, #0e112a 0%, #050616 100%); border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 36px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.8);">
                  
                  <!-- Glossy Top Accent -->
                  <tr>
                    <td style="height: 4px; background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1); background-size: 200% 100%;"></td>
                  </tr>

                  <!-- Hero Header -->
                  <tr>
                    <td align="center" style="padding: 60px 40px 40px 40px; position: relative;">
                      <div style="background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%); width: 250px; height: 250px; position: absolute; top: -50px; left: 50%; transform: translateX(-50%); z-index: 0;"></div>
                      <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); width: 84px; height: 84px; border-radius: 24px; display: inline-block; text-align: center; margin-bottom: 30px; box-shadow: 0 15px 35px rgba(79, 70, 229, 0.4); z-index: 1; position: relative;">
                        <span style="font-size: 40px; line-height: 84px; filter: drop-shadow(0 0 12px rgba(255,255,255,0.4));">✨</span>
                      </div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 34px; font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; z-index: 1; position: relative;">Order <span style="background: linear-gradient(90deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: #6366f1;">Confirmed</span></h1>
                      <p style="color: rgba(255,255,255,0.5); font-size: 17px; margin: 15px 0 0 0; font-weight: 500; z-index: 1; position: relative;">Hi ${customer_name.split(' ')[0]}, your wellness journey is our priority.</p>
                    </td>
                  </tr>

                  <!-- Order Info Bar -->
                  <tr>
                    <td style="padding: 0 40px;">
                       <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 20px;">
                          <tr>
                             <td align="left">
                                <div style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 4px;">Order ID</div>
                                <div style="color: #ffffff; font-size: 14px; font-weight: 700;">#${order_id || 'PENDING'}</div>
                             </td>
                             <td align="center" style="border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">
                                <div style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 4px;">Placed On</div>
                                <div style="color: #ffffff; font-size: 14px; font-weight: 700;">${date}</div>
                             </td>
                             <td align="right">
                                <div style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 4px;">Time</div>
                                <div style="color: #ffffff; font-size: 14px; font-weight: 700;">${order_time || '--:--'}</div>
                             </td>
                          </tr>
                       </table>
                    </td>
                  </tr>

                  <!-- Main Receipt -->
                  <tr>
                    <td style="padding: 30px 40px 20px 40px;">
                      <h3 style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0 0 20px 0; display: flex; align-items: center;">Summary <span style="margin-left: 10px; background: rgba(99, 102, 241, 0.1); color: #6366f1; padding: 4px 12px; border-radius: 8px; font-size: 12px;">Invoice</span></h3>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 24px; padding: 25px; backdrop-filter: blur(20px);">
                        <tr>
                          <td>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                              ${formattedItems}
                            </table>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px; padding-top: 20px; border-top: 1px dashed rgba(255,255,255,0.1);">
                              <tr>
                                <td style="color: rgba(255,255,255,0.4); font-size: 14px; padding: 6px 0;">Subtotal</td>
                                <td align="right" style="color: #ffffff; font-size: 14px; padding: 6px 0; font-weight: 600;">${subtotal}</td>
                              </tr>
                              <tr>
                                <td style="color: rgba(255,255,255,0.4); font-size: 14px; padding: 6px 0;">Shipping</td>
                                <td align="right" style="color: #10b981; font-size: 14px; padding: 6px 0; font-weight: 600;">${shipping === 'Rs. 0' ? 'FREE' : shipping}</td>
                              </tr>
                              <tr>
                                <td style="color: rgba(255,255,255,0.4); font-size: 14px; padding: 6px 0;">GST / Tax</td>
                                <td align="right" style="color: #ffffff; font-size: 14px; padding: 6px 0; font-weight: 600;">${tax}</td>
                              </tr>
                              <tr>
                                <td style="color: #ffffff; font-size: 20px; font-weight: 800; padding: 25px 0 0 0;">Total Amount</td>
                                <td align="right" style="color: #6366f1; font-size: 30px; font-weight: 900; padding: 25px 0 0 0; font-family: 'Helvetica', sans-serif; letter-spacing: -1px;">${total_amount}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Address & Timeline Row -->
                  <tr>
                    <td style="padding: 10px 40px 30px 40px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                           <td width="48%" valign="top" style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 20px; padding: 20px;">
                               <div style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 12px;">Ship To</div>
                               <div style="color: #ffffff; font-size: 14px; line-height: 1.6; font-weight: 600;">
                                 <span style="color: #6366f1;">${customer_name}</span><br/>
                                 <span style="font-weight: 400; color: rgba(255,255,255,0.7);">${shipping_address}</span>
                               </div>
                           </td>
                           <td width="4%"></td>
                           <td width="48%" valign="top" style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.1); border-radius: 20px; padding: 20px;">
                               <div style="color: rgba(99, 102, 241, 0.6); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 15px;">Next Steps</div>
                               <div style="color: #ffffff; font-size: 13px; line-height: 1.4;">
                                 <div style="margin-bottom: 10px;">✅ Confirmed</div>
                                 <div style="margin-bottom: 10px; opacity: 0.5;">📦 Processing</div>
                                 <div style="opacity: 0.5;">🚚 Shipped</div>
                               </div>
                           </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- WhatsApp Action Card -->
                  <tr>
                    <td style="padding: 0 40px 30px 40px;">
                       <a href="${whatsappUrl}" style="text-decoration: none; display: block;">
                         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 28px; padding: 25px; overflow: hidden;">
                            <tr>
                              <td style="padding-left: 20px;">
                                 <div style="color: #ffffff; font-size: 16px; font-weight: 800; margin-bottom: 2px;">Wellness Concierge</div>
                                 <div style="color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 500;">Connect with our experts for priority assistance.</div>
                              </td>
                              <td align="right">
                                 <div style="text-align: center;">
                                    <img src="https://cdn-icons-png.flaticon.com/32/733/733585.png" width="32" height="32" alt="WhatsApp" style="opacity: 0.9; filter: drop-shadow(0 0 10px rgba(37, 211, 102, 0.5));">
                                 </div>
                              </td>
                            </tr>
                         </table>
                       </a>
                    </td>
                  </tr>

                  <!-- Footer / Brand / Socials -->
                  <tr>
                    <td align="center" style="padding: 50px 40px 40px 40px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05);">
                       <div style="margin-bottom: 30px; letter-spacing: 4px; font-weight: 900; color: #ffffff; font-size: 20px;">ARCURE <span style="color: #6366f1;">PHARMA</span></div>
                       
                       <div style="margin-bottom: 35px;">
                          ${social_links?.map(link => {
                            const iconUrl = iconMap[link.name];
                            return iconUrl ? `
                              <a href="${link.url}" style="text-decoration: none; margin: 0 15px; display: inline-block;">
                                <img src="${iconUrl}" width="26" height="26" alt="${link.name}" style="display: block; opacity: 0.8; filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));">
                              </a>
                            ` : "";
                          }).join("")}
                       </div>
                       
                       <p style="color: rgba(255,255,255,0.3); font-size: 13px; line-height: 1.8; margin: 0; max-width: 400px;">
                        Our team will verify your order via phone shortly before shipping your premium selection.<br/><br/>
                        &copy; 2026 Arcure Pharma PVT LTD.<br/>
                        Built for ultimate wellness and pharmaceutical excellence.
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
