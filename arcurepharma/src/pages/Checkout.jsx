import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import fallbackImg from "../assets/pics/products/0.jpg";
import { shippingData } from "../dependencies/shippingData";
import HeroSection from "../components/shared/HeroSection";
import GlassCard from "../components/shared/GlassCard";
import FormInput from "../components/shared/FormInput";
import OrderSummary from "../components/shared/OrderSummary";
import socialLinks from "../dependencies/socialLinks";

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const taxAmount = getCartTotal() * (shippingData.TAX_PERCENTAGE / 100);
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      const totalAmountVal =
        getCartTotal() +
        (getCartTotal() >= shippingData.FREE_SHIPPING_THRESHOLD
          ? 0
          : shippingData.SHIPPING_COST) +
        taxAmount;

      const orderDetailsStr = cart
        .map(
          (item) =>
            `${item.name} x ${item.quantity} — Rs. ${(
              item.price * item.quantity
            ).toLocaleString()}`,
        )
        .join("\n");

      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            order_details: orderDetailsStr,
            subtotal: `Rs. ${getCartTotal().toLocaleString()}`,
            shipping: `Rs. ${(getCartTotal() >= shippingData.FREE_SHIPPING_THRESHOLD ? 0 : shippingData.SHIPPING_COST).toLocaleString()}`,
            tax: `Rs. ${taxAmount.toLocaleString()}`,
            total_amount: `Rs. ${totalAmountVal.toLocaleString()}`,
            shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}`,
            social_links: socialLinks.map((link) => ({
              name: link.name,
              url: link.url,
            })),
          }),
        });
      } catch (error) {
        console.error("Email API failed:", error);
      }

      setIsSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        clearCart();
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-modern pt-5 overflow-hidden">
        <div className="success-screen-wrapper container">
          <div className="success-card-premium">
            <div className="checkmark-container">
              <div className="checkmark-glow"></div>
              <svg
                className="checkmark-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark-check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>

            <div className="reveal-text delay-1">
              <span className="hero-subtitle mb-2 d-block">
                Order Successfully Placed
              </span>
              <h1 className="hero-title mb-4">
                Thank <span className="text-gradient">You!</span>
              </h1>
            </div>

            <div
              className="reveal-text delay-2 glass-card p-4 mx-auto mb-5"
              style={{
                maxWidth: "500px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <p className="op-7 mb-0">
                Your health is our priority. Our team will verify your order via
                phone shortly before shipping your premium selection.
              </p>
            </div>

            <div className="reveal-text delay-3">
              <Link
                to="/"
                className="btn-modern-submit text-decoration-none px-5 py-3"
              >
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-modern pt-5">
        <div className="container section-spacing text-center py-5">
          <GlassCard
            className="py-5 my-5 mx-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="empty-cart-icon mb-4" style={{ fontSize: "4rem" }}>
              🛒
            </div>
            <h2 className="hero-title mb-4">
              No Order to <span className="text-gradient">Checkout</span>
            </h2>
            <p className="op-7 lead mb-5">
              Looks like you haven't added any premium wellness products yet.
            </p>
            <Link
              to="/"
              className="btn-modern-submit premium-btn text-decoration-none px-5"
            >
              Start Shopping
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-modern pt-5">
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="container section-spacing">
        <HeroSection
          subtitle="Secure Payment"
          title={
            <>
              Complete <span className="text-gradient">Order</span>
            </>
          }
        />

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-5">
            {/* Shipping & Payment Form */}
            <div className="col-lg-7">
              <GlassCard className="p-4 p-md-5">
                <h3 className="footer-title mb-4">Shipping Information</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormInput
                      label="First Name"
                      id="checkout-firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      error={errors.firstName}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="col-md-6">
                    <FormInput
                      label="Last Name"
                      id="checkout-lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={errors.lastName}
                      autoComplete="family-name"
                    />
                  </div>
                  <div className="col-12">
                    <FormInput
                      label="Email Address"
                      id="checkout-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>
                  <div className="col-md-6">
                    <FormInput
                      label="Phone Number"
                      id="checkout-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      error={errors.phone}
                      placeholder="+1234567890"
                      autoComplete="tel"
                    />
                  </div>
                  <div className="col-md-6">
                    <FormInput
                      label="WhatsApp Number"
                      id="checkout-whatsapp"
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      error={errors.whatsapp}
                      placeholder="+1234567890"
                      autoComplete="tel"
                    />
                  </div>
                  <div className="col-12">
                    <FormInput
                      label="Shipping Address"
                      id="checkout-address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      error={errors.address}
                      autoComplete="street-address"
                    />
                  </div>
                  <div className="col-md-6">
                    <FormInput
                      label="City"
                      id="checkout-city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      error={errors.city}
                      autoComplete="address-level2"
                    />
                  </div>
                  <div className="col-md-6">
                    <FormInput
                      label="ZIP / Postal Code"
                      id="checkout-zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      error={errors.zip}
                      autoComplete="postal-code"
                    />
                  </div>
                </div>

                <h3 className="footer-title mb-4 mt-4">Payment Selection</h3>
                <GlassCard
                  className="p-4 border-indigo-light"
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
                </GlassCard>
                <div className="mt-3 p-3 rounded-block bg-white-5 op-7 small d-flex gap-2">
                  <span>ℹ️</span>
                  <span>
                    Please ensure someone is available at the address to receive
                    the package and make the payment.
                  </span>
                </div>
              </GlassCard>
            </div>

            <div className="col-lg-5">
              <div className="sticky-summary-wrapper">
                <OrderSummary
                  subtotal={getCartTotal()}
                  taxAmount={taxAmount}
                  taxPercentage={shippingData.TAX_PERCENTAGE}
                  shippingCost={shippingData.SHIPPING_COST}
                  shippingDiscount={
                    getCartTotal() >= shippingData.FREE_SHIPPING_THRESHOLD
                      ? shippingData.SHIPPING_COST
                      : 0
                  }
                  total={
                    getCartTotal() +
                    (getCartTotal() >= shippingData.FREE_SHIPPING_THRESHOLD
                      ? 0
                      : shippingData.SHIPPING_COST) +
                    taxAmount
                  }
                  currency={shippingData.CURRENCY}
                >
                  <div
                    className="order-items-scroll mt-4 mb-4"
                    style={{ maxHeight: "250px", overflowY: "auto" }}
                  >
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center justify-content-between mb-3 px-1"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "8px",
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
                            <div
                              className="text-white extra-small font-weight-bold"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {item.name}
                            </div>
                            <div className="text-white-50 tiny">
                              Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div
                          className="text-white extra-small"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {shippingData.CURRENCY}{" "}
                          {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-modern-submit premium-btn w-100 py-3 shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Complete Purchase"}
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
                    Secure Encrypted Checkout
                  </div>
                </OrderSummary>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
