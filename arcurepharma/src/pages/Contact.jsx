import React, { useState } from "react";
import contactInfo from "../dependencies/contactInfo";

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
      <div className="background-modern d-flex flex-column pt-5">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="container section-spacing">
          {/* Hero Section */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <span className="hero-subtitle">Get In Touch</span>
              <h1 className="hero-title mb-4">
                Let's Start a{" "}
                <span className="text-gradient">Conversation</span>
              </h1>
              <p
                className="lead op-8"
                style={{ fontSize: "1.25rem", fontWeight: 300 }}
              >
                Have questions or want to learn more about our work? We're here
                to help.
              </p>
            </div>
          </div>

          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="glass-card">
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
                      <div className="form-group">
                        <label
                          htmlFor="contact-name"
                          className="text-white-50 mb-2 small"
                        >
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          autoComplete="name"
                          className={`form-control glass-input ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <div className="error-text">{errors.name}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label
                          htmlFor="contact-email"
                          className="text-white-50 mb-2 small"
                        >
                          Your Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          autoComplete="email"
                          className={`form-control glass-input ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <div className="error-text">{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label
                          htmlFor="contact-subject"
                          className="text-white-50 mb-2 small"
                        >
                          Subject
                        </label>
                        <input
                          id="contact-subject"
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className={`form-control glass-input ${
                            errors.subject ? "is-invalid" : ""
                          }`}
                          placeholder="How can we help?"
                        />
                        {errors.subject && (
                          <div className="error-text">{errors.subject}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label
                          htmlFor="contact-message"
                          className="text-white-50 mb-2 small"
                        >
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          className={`form-control glass-input ${
                            errors.message ? "is-invalid" : ""
                          }`}
                          rows="4"
                          placeholder="Write your message here..."
                        ></textarea>
                        {errors.message && (
                          <div className="error-text">{errors.message}</div>
                        )}
                      </div>
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
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-4 h-100">
                {/* Info Card 1 */}
                <div className="glass-card d-flex align-items-center p-4">
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
                </div>

                {/* Info Card 2 */}
                <div className="glass-card d-flex align-items-center p-4">
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
                </div>

                {/* Info Card 3 */}
                <div className="glass-card d-flex align-items-center p-4">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
