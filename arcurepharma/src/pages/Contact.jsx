import React, { useState } from "react";
import contactInfo from "../dependencies/contactInfo";
import HeroSection from "../components/shared/HeroSection";
import GlassCard from "../components/shared/GlassCard";
import FormInput from "../components/shared/FormInput";

export default function Contact() {
  const [toasts, setToasts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    _honey: "", // Honeypot field
    captchaAnswer: "", // User's answer to math problem
  });
  // Track mount time for bot protection
  const [startTime] = useState(Date.now());
  const [captchaMath, setCaptchaMath] = useState({ num1: 0, num2: 0 });
  const [showCaptcha, setShowCaptcha] = useState(false);

  React.useEffect(() => {
    // Generate random numbers for CAPTCHA
    setCaptchaMath({
      num1: Math.floor(Math.random() * 9) + 1,
      num2: Math.floor(Math.random() * 9) + 1,
    });
  }, []);
  const [errors, setErrors] = useState({});

  const showToast = (message, type = "success") => {
    const id = Date.now();
    const newToast = { id, message, type, isHiding: false };

    setToasts((prev) => [...prev, newToast]);

    // Start hiding phase
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isHiding: true } : t)),
      );

      // Remove from array after animation
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 500);
    }, 3000);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      // Stricter email regex: prevents spaces, requires TLD of at least 2 chars
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = async () => {
    // BOT PROTECTION: Honeypot Check
    if (formData._honey) {
      console.warn("Bot detected: Honeypot filled");
      return; // Silent failure
    }

    // Time-based check: If submitted too quickly (< 3 seconds), Trigger CAPTCHA
    const timeElapsed = Date.now() - startTime;
    if (!showCaptcha && timeElapsed < 3000) {
      console.warn(
        "Bot detected: Submitted too fast. Challenging with CAPTCHA.",
      );
      setShowCaptcha(true);
      setErrors((prev) => ({
        ...prev,
        captcha: "Please verify you are human by solving the math problem.",
      }));
      return;
    }

    // Math CAPTCHA Check (Only if triggered)
    if (showCaptcha) {
      if (
        parseInt(formData.captchaAnswer) !==
        captchaMath.num1 + captchaMath.num2
      ) {
        setErrors((prev) => ({
          ...prev,
          captcha: "Incorrect verification code. Please try again.",
        }));
        return;
      }
    }

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "contact",
            ...formData,
          }),
        });

        if (response.ok) {
          showToast(
            "✅ Message sent successfully! We'll get back to you soon.",
            "success",
          );
          setFormData({ name: "", email: "", subject: "", message: "" });
        } else {
          showToast(
            "❌ Failed to send message. Please try again or contact us directly.",
            "error",
          );
        }
      } catch (error) {
        console.error("Error sending message:", error);
        showToast(
          "❌ Failed to send message. Please try again or contact us directly.",
          "error",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <div className="bg-modern d-flex flex-column pt-5">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="container section-spacing">
          <HeroSection
            subtitle="Get In Touch"
            title={
              <>
                Let's Start a{" "}
                <span className="text-gradient">Conversation</span>
              </>
            }
            description="Have questions or want to learn more about our work? We're here to help."
          />

          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-7">
              <GlassCard>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold mb-0">Send us a Message</h3>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  {/* Honeypot Hidden Field */}
                  <div
                    style={{
                      display: "none",
                      opacity: 0,
                      position: "absolute",
                      left: "-9999px",
                    }}
                  >
                    <input
                      type="text"
                      name="_honey"
                      value={formData._honey}
                      onChange={handleInputChange}
                      tabIndex="-1"
                      autoComplete="off"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <FormInput
                        label="Your Name"
                        id="contact-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                        placeholder="John Doe"
                        autoComplete="name"
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label="Your Email"
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        placeholder="john@example.com"
                        autoComplete="email"
                      />
                    </div>
                    <div className="col-12">
                      <FormInput
                        label="Subject"
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        error={errors.subject}
                        placeholder="How can we help?"
                      />
                    </div>
                    <div className="col-12">
                      <FormInput
                        label="Message"
                        id="contact-message"
                        type="textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        error={errors.message}
                        placeholder="Write your message here..."
                      />
                    </div>

                    {/* Math CAPTCHA Field - Adaptive (Only shows if suspicious) */}
                    {showCaptcha && (
                      <div className="col-12 mt-3">
                        <label className="form-label text-white-50 small mb-2">
                          Human Verification: What is{" "}
                          <strong>
                            {captchaMath.num1} + {captchaMath.num2}
                          </strong>
                          ?
                        </label>
                        <input
                          type="number"
                          name="captchaAnswer"
                          className={`form-control glass-input ${errors.captcha ? "is-invalid" : ""}`}
                          value={formData.captchaAnswer}
                          onChange={handleInputChange}
                          placeholder="Calculate sum"
                          required
                        />
                        {errors.captcha && (
                          <div className="invalid-feedback d-block mt-1">
                            {errors.captcha}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="col-12 mt-4">
                      <button
                        type="button"
                        className="btn btn-modern-submit w-100"
                        onClick={handleSendMessage}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </div>
                </form>
              </GlassCard>
            </div>

            <div className="col-lg-5">
              <div className="d-flex flex-column gap-4 h-100">
                {/* Info Card 1 */}
                <GlassCard className="d-flex align-items-center p-4">
                  <div
                    className="icon-box flex-shrink-0"
                    style={{
                      marginBottom: 0,
                      width: "50px",
                      height: "50px",
                      fontSize: "1.2rem",
                    }}
                  >
                    📍
                  </div>
                  <div className="ms-4">
                    <h5 className="fw-bold mb-1">Our Location</h5>
                    <p className="op-7 small mb-0">
                      {contactInfo.address.line1},<br />
                      {contactInfo.address.line2}
                    </p>
                  </div>
                </GlassCard>

                {/* Info Card 2 */}
                <GlassCard className="d-flex align-items-center p-4">
                  <div
                    className="icon-box flex-shrink-0"
                    style={{
                      marginBottom: 0,
                      width: "50px",
                      height: "50px",
                      fontSize: "1.2rem",
                    }}
                  >
                    📞
                  </div>
                  <div className="ms-4">
                    <h5 className="fw-bold mb-1">Phone Number</h5>
                    <p className="op-7 small mb-0">
                      {contactInfo.phone.number}
                      <br />
                      {contactInfo.phone.hours}
                    </p>
                  </div>
                </GlassCard>

                {/* Info Card 3 */}
                <GlassCard className="d-flex align-items-center p-4">
                  <div
                    className="icon-box flex-shrink-0"
                    style={{
                      marginBottom: 0,
                      width: "50px",
                      height: "50px",
                      fontSize: "1.2rem",
                    }}
                  >
                    ✉️
                  </div>
                  <div className="ms-4">
                    <h5 className="fw-bold mb-1">Email Address</h5>
                    <p className="op-7 small mb-0">
                      {contactInfo.email.primary}
                      <br />
                      {contactInfo.email.support}
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stacking Toast Banner */}
      <div className="modern-toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`modern-toast ${t.isHiding ? "hiding" : ""} ${t.type === "error" ? "toast-error" : ""}`}
          >
            <div className="toast-message">{t.message}</div>
          </div>
        ))}
      </div>
    </>
  );
}
