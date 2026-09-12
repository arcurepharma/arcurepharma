"use client";

import { useState } from "react";
import { paymentMethods, PaymentMethod } from "@/lib/payment";
import { Check } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
      
      {paymentMethods
        .filter((pm) => pm.enabled)
        .map((method) => (
          <label
            key={method.method}
            className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selectedMethod === method.method
                ? "border-teal-600 bg-teal-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.method}
              checked={selectedMethod === method.method}
              onChange={() => onMethodChange(method.method)}
              className="sr-only"
            />
            
            <div className="flex items-start gap-4 flex-1">
              <div className="text-3xl">{method.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {method.label}
                  </span>
                  {method.method === "COD" && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {method.description}
                </p>
                {method.fees && method.fees > 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    + Rs. {method.fees} processing fee
                  </p>
                )}
              </div>
            </div>

            {selectedMethod === method.method && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </label>
        ))}

      {/* Additional Info for COD */}
      {selectedMethod === "COD" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Cash on Delivery:</span> Pay when
            you receive your order. Please keep exact change ready for smooth
            delivery.
          </p>
        </div>
      )}

      {/* Additional Info for Digital Payments */}
      {(selectedMethod === "JazzCash" || selectedMethod === "EasyPaisa") && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mt-4">
          <p className="text-sm text-teal-800">
            <span className="font-semibold">📱 Mobile Wallet:</span> You'll be
            redirected to complete payment securely. Make sure you have the{" "}
            {selectedMethod} app installed.
          </p>
        </div>
      )}
    </div>
  );
}
