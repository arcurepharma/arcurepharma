import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import fallbackImg from "../assets/pics/products/0.jpg";

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    zip: "",
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/[\s()-]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number (e.g., 03001245300)";
    }

    // WhatsApp is optional, but if provided, validate format
    if (
      formData.whatsapp.trim() &&
      !/^\+?\d{10,15}$/.test(formData.whatsapp.replace(/[\s()-]/g, ""))
    ) {
      newErrors.whatsapp = "Please enter a valid WhatsApp number";
    }

    if (!formData.address.trim())
      newErrors.address = "Shipping address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.zip.trim()) newErrors.zip = "ZIP/Postal code is required";

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

  const handleImageError = (e) => {
    e.target.src = fallbackImg;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate payment processing
      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className="background-modern-home pt-5">
        <div className="container section-spacing text-center py-5">
          <div
            className="glass-card py-5 my-5 mx-auto reveal-item"
            style={{ maxWidth: "600px" }}
          >
            <div className="success-icon mb-4" style={{ fontSize: "5rem" }}>
              ✅
            </div>
            <h2 className="hero-title mb-4">
              Order <span className="text-gradient">Confirmed!</span>
            </h2>
            <p className="op-7 lead mb-5">
              Thank you for choosing Arcurepharma. Our team will contact you
              shortly to verify your order before shipping.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link
                to="/home"
                className="btn-modern-submit text-decoration-none"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="background-modern-home pt-5">
        <div className="container section-spacing text-center py-5">
          <div
            className="glass-card py-5 my-5 mx-auto"
            style={{ maxWidth: "600px" }}
          >
            <h2 className="hero-title mb-4">
              No Order to <span className="text-gradient">Checkout</span>
            </h2>
            <Link to="/home" className="btn-modern-submit text-decoration-none">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="background-modern-home pt-5">
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="container section-spacing">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <span className="hero-subtitle">Secure Payment</span>
            <h1 className="hero-title">
              Complete <span className="text-gradient">Order</span>
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-5">
            {/* Shipping & Payment Form */}
            <div className="col-lg-7">
              <div className="glass-card p-4 p-md-5">
                <h3 className="footer-title mb-4">Shipping Information</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="checkout-firstName"
                      className="form-label op-7"
                    >
                      First Name
                    </label>
                    <input
                      id="checkout-firstName"
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      className={`glass-input w-100 ${
                        errors.firstName ? "is-invalid" : ""
                      }`}
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    {errors.firstName && (
                      <div className="error-text">{errors.firstName}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="checkout-lastName"
                      className="form-label op-7"
                    >
                      Last Name
                    </label>
                    <input
                      id="checkout-lastName"
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      className={`glass-input w-100 ${
                        errors.lastName ? "is-invalid" : ""
                      }`}
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                    {errors.lastName && (
                      <div className="error-text">{errors.lastName}</div>
                    )}
                  </div>
                  <div className="col-12">
                    <label htmlFor="checkout-email" className="form-label op-7">
                      Email Address
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      className={`glass-input w-100 ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <div className="error-text">{errors.email}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="checkout-phone" className="form-label op-7">
                      Phone Number
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      className={`glass-input w-100 ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      placeholder="+1234567890"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {errors.phone && (
                      <div className="error-text">{errors.phone}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="checkout-whatsapp"
                      className="form-label op-7"
                    >
                      WhatsApp Number
                    </label>
                    <input
                      id="checkout-whatsapp"
                      type="tel"
                      name="whatsapp"
                      autoComplete="tel"
                      className={`glass-input w-100 ${
                        errors.whatsapp ? "is-invalid" : ""
                      }`}
                      placeholder="+1234567890"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                    />
                    {errors.whatsapp && (
                      <div className="error-text">{errors.whatsapp}</div>
                    )}
                  </div>
                  <div className="col-12">
                    <label
                      htmlFor="checkout-address"
                      className="form-label op-7"
                    >
                      Shipping Address
                    </label>
                    <input
                      id="checkout-address"
                      type="text"
                      name="address"
                      autoComplete="street-address"
                      className={`glass-input w-100 ${
                        errors.address ? "is-invalid" : ""
                      }`}
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    {errors.address && (
                      <div className="error-text">{errors.address}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="checkout-city" className="form-label op-7">
                      City
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      name="city"
                      autoComplete="address-level2"
                      className={`glass-input w-100 ${
                        errors.city ? "is-invalid" : ""
                      }`}
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    {errors.city && (
                      <div className="error-text">{errors.city}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="checkout-zip" className="form-label op-7">
                      ZIP / Postal Code
                    </label>
                    <input
                      id="checkout-zip"
                      type="text"
                      name="zip"
                      autoComplete="postal-code"
                      className={`glass-input w-100 ${
                        errors.zip ? "is-invalid" : ""
                      }`}
                      value={formData.zip}
                      onChange={handleInputChange}
                    />
                    {errors.zip && (
                      <div className="error-text">{errors.zip}</div>
                    )}
                  </div>
                </div>

                <h3 className="footer-title mb-4 mt-4">Payment Selection</h3>
                <div
                  className="glass-card p-4 border-indigo-light"
                  style={{ background: "rgba(99, 102, 241, 0.05)" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="success-icon" style={{ fontSize: "2rem" }}>
                      🚚
                    </div>
                    <div>
                      <h5 className="text-white mb-1">
                        Cash on Delivery (COD)
                      </h5>
                      <p className="op-7 small mb-0">
                        Total amount will be collected at your shipping address
                        by our delivery partner.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-block bg-white-5 op-7 small d-flex gap-2">
                  <span>ℹ️</span>
                  <span>
                    Please ensure someone is available at the address to receive
                    the package and make the payment.
                  </span>
                </div>
              </div>
            </div>

            {/* Order Review Sidebar */}
            <div className="col-lg-5">
              <div className="sticky-summary-wrapper">
                <div className="glass-card p-4">
                  <h3 className="footer-title mb-4">Order Review</h3>

                  <div
                    className="order-items-scroll mb-4"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "10px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={
                                item.imageUrl || item.imagePath || fallbackImg
                              }
                              alt={item.name}
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                              onError={handleImageError}
                            />
                          </div>
                          <div>
                            <div className="text-white small font-weight-bold">
                              {item.name}
                            </div>
                            <div className="text-white-50 tiny">
                              Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="text-white small">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />

                  <div className="summary-details mb-4">
                    <div className="d-flex justify-content-between mb-2 text-white-50 small">
                      <span>Subtotal</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 text-white-50 small">
                      <span>Shipping</span>
                      <span
                        className={
                          getCartTotal() >= 150 ? "text-success" : "text-white"
                        }
                      >
                        {getCartTotal() >= 150 ? "Free" : "$5.00"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <span className="h5 text-white">Final Total</span>
                      <span className="h4 text-gradient font-weight-bold">
                        $
                        {(
                          getCartTotal() + (getCartTotal() >= 150 ? 0 : 5)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-modern-submit w-100 py-3 shadow-lg"
                  >
                    Complete Purchase
                  </button>

                  <div className="text-white-50 text-center mt-3 small">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="me-1"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Secure SSL Encrypted Checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
