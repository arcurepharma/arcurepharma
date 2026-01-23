import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import fallbackImg from "../assets/pics/products/0.jpg";
import { shippingData } from "../dependencies/shippingData";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } =
    useCart();
  const navigate = useNavigate();
  const [shippingProgress, setShippingProgress] = useState(0);

  useEffect(() => {
    const total = getCartTotal();
    const progress = Math.min(
      (total / shippingData.FREE_SHIPPING_THRESHOLD) * 100,
      100,
    );
    setShippingProgress(progress);
  }, [getCartTotal]);

  const handleImageError = (e) => {
    e.target.src = fallbackImg;
  };

  const amountAway = Math.max(
    0,
    shippingData.FREE_SHIPPING_THRESHOLD - getCartTotal(),
  );
  const taxAmount = getCartTotal() * (shippingData.TAX_PERCENTAGE / 100);

  if (cart.length === 0) {
    return (
      <div className="background-modern-home pt-5">
        <div className="container section-spacing text-center py-5">
          <div
            className="glass-card py-5 my-5 mx-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="empty-cart-icon mb-4" style={{ fontSize: "4rem" }}>
              🛒
            </div>
            <h2 className="hero-title mb-4">
              Your Cart is <span className="text-gradient">Empty</span>
            </h2>
            <p className="op-7 lead mb-5">
              Looks like you haven't added any premium wellness products yet.
            </p>
            <Link to="/" className="btn-modern-submit text-decoration-none">
              Continue Shopping
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
        <div className="shape"></div>
      </div>

      <div className="container section-spacing pb-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <span className="hero-subtitle">Premium Selection</span>
            <h1 className="hero-title">
              Your <span className="text-gradient">Cart</span>
            </h1>
            <p className="op-7 lead mb-0">
              {getCartCount()} item{getCartCount() !== 1 ? "s" : ""} ships at
              checkout
            </p>
          </div>
        </div>

        <div className="row g-5">
          {/* Right Column: Items */}
          <div className="col-lg-8">
            {/* Free Shipping Progress */}
            <div className="shipping-progress-card reveal-item">
              <div className="shipping-info-text">
                <span className="shipping-msg">
                  {amountAway > 0
                    ? `You're ${shippingData.CURRENCY} ${amountAway.toLocaleString()} away from FREE SHIPPING!`
                    : "✨ You've unlocked FREE SHIPPING!"}
                </span>
                <Link to="/" className="keep-shopping-link">
                  Keep Shopping
                </Link>
              </div>
              <div className="progress-glass-container">
                <div
                  className="progress-glass-fill"
                  style={{ width: `${shippingProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="cart-items-wrapper">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="cart-item-card-v2 p-3 reveal-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="d-flex flex-column flex-md-row align-items-center">
                    <img
                      src={item.imageUrl || item.imagePath || fallbackImg}
                      alt={item.name}
                      className="cart-item-img-v2"
                      onError={handleImageError}
                    />
                    <div className="cart-item-details-v2 w-100">
                      <div className="cart-item-meta-v2 mt-3 mt-md-0">
                        <div>
                          <h4 className="text-white mb-1">{item.name}</h4>
                          <span
                            className="modal-category"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {item.category}
                          </span>
                        </div>
                        <button
                          className="remove-item-btn-v2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="cart-item-footer-v2 mt-4">
                        <div className="quantity-selector">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className="item-price-v2 text-gradient">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link
                to="/"
                className="text-white-50 text-decoration-none d-flex align-items-center gap-2"
              >
                ← Back to Products
              </Link>
            </div>
          </div>

          {/* Left Column: Summary */}
          <div className="col-lg-4">
            <div
              className="cart-summary-card-v2 reveal-item"
              style={{ animationDelay: "0.3s" }}
            >
              <h3
                className="hero-title pt-0 mb-4"
                style={{ fontSize: "1.8rem" }}
              >
                Summary
              </h3>

              <div className="summary-details-v2">
                <div className="summary-row-v2">
                  <span>Subtotal ({getCartCount()} Items)</span>
                  <span>
                    {shippingData.CURRENCY} {getCartTotal().toLocaleString()}
                  </span>
                </div>
                <div className="summary-row-v2">
                  <span>Tax ({shippingData.TAX_PERCENTAGE}%)</span>
                  <span>
                    {shippingData.CURRENCY} {taxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="summary-row-v2">
                  <span>Shipping & Handling</span>
                  <span>
                    {shippingData.CURRENCY} {shippingData.SHIPPING_COST}
                  </span>
                </div>
                <div className="summary-row-v2">
                  <span>Shipping Discount</span>
                  <span className={amountAway === 0 ? "text-success" : ""}>
                    {amountAway === 0
                      ? `-${shippingData.CURRENCY} ${shippingData.SHIPPING_COST}`
                      : `${shippingData.CURRENCY} 0`}
                  </span>
                </div>

                <div className="summary-row-v2 total">
                  <span>Balance</span>
                  <span className="text-gradient">
                    {shippingData.CURRENCY}{" "}
                    {(
                      getCartTotal() +
                      (amountAway === 0 ? 0 : shippingData.SHIPPING_COST) +
                      taxAmount
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="btn-checkout-v2"
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </button>

              <div className="mt-4 pt-3 border-top border-white-10">
                <div className="cod-premium-badge text-center d-flex flex-column align-items-center">
                  <div className="cod-icon-wrapper">🚚</div>
                  <h5 className="cod-title mb-1">Cash on Delivery</h5>
                  <p className="cod-text mb-0">
                    Secure doorstep payment guaranteed
                  </p>

                  <div className="mt-3 op-4 tiny d-flex align-items-center gap-2">
                    <span
                      className="dot"
                      style={{
                        width: "6px",
                        height: "6px",
                        background: "#22c55e",
                        borderRadius: "50%",
                      }}
                    ></span>
                    Available for your location
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
