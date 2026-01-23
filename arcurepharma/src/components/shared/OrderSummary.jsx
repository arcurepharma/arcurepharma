import React from "react";

const OrderSummary = ({
  subtotal,
  taxAmount,
  taxPercentage,
  shippingCost,
  shippingDiscount,
  total,
  currency = "Rs.",
  itemsCount,
  children,
  className = "",
}) => {
  return (
    <div className={`cart-summary-card-v2 ${className}`}>
      <h3 className="hero-title pt-0 mb-4" style={{ fontSize: "1.8rem" }}>
        Summary
      </h3>

      <div className="summary-details-v2">
        <div className="summary-row-v2">
          <span>
            Subtotal {itemsCount !== undefined && `(${itemsCount} Items)`}
          </span>
          <span>
            {currency} {subtotal.toLocaleString()}
          </span>
        </div>
        <div className="summary-row-v2">
          <span>Tax ({taxPercentage}%)</span>
          <span>
            {currency} {taxAmount.toLocaleString()}
          </span>
        </div>
        <div className="summary-row-v2">
          <span>Shipping & Handling</span>
          <span>
            {currency} {shippingCost.toLocaleString()}
          </span>
        </div>
        <div className="summary-row-v2">
          <span>Shipping Discount</span>
          <span className={shippingDiscount > 0 ? "text-success" : ""}>
            {shippingDiscount > 0
              ? `-${currency} ${shippingDiscount.toLocaleString()}`
              : `${currency} 0`}
          </span>
        </div>

        <div className="summary-row-v2 total">
          <span>Balance</span>
          <span className="text-gradient">
            {currency} {total.toLocaleString()}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
};

export default OrderSummary;
