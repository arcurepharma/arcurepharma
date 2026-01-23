import React, { useState } from "react";
import contactInfo from "../dependencies/contactInfo";
import HeroSection from "../components/shared/HeroSection";
import GlassCard from "../components/shared/GlassCard";
import FormInput from "../components/shared/FormInput";

export default function Contact() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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

  const handleSendMessage = () => {
    if (validateForm()) {
      setShowSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setShowSuccess(false), 5000);
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

                {showSuccess && (
                  <div className="success-banner mb-4 animate__animated animate__fadeInDown">
                    <span className="me-2">✅</span>
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                <form>
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
                    <div className="col-12 mt-4">
                      <button
                        type="button"
                        className="btn btn-modern-submit w-100"
                        onClick={handleSendMessage}
                      >
                        Send Message
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
    </>
  );
}
