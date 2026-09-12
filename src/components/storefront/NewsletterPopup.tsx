"use client";

import { useEffect, useState } from "react";
import { X, Mail, Tag, Sparkles } from "lucide-react";
import Image from "next/image";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if user has already subscribed or dismissed
    const hasSubscribed = localStorage.getItem("arcure-newsletter-subscribed");
    const hasDismissed = localStorage.getItem("arcure-newsletter-dismissed");
    const dismissedTime = localStorage.getItem("arcure-newsletter-dismissed-time");

    if (hasSubscribed || (hasDismissed && dismissedTime)) {
      // Don't show if subscribed or dismissed within last 7 days
      const daysSinceDismissed = dismissedTime
        ? (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
        : 999;
      if (hasSubscribed || daysSinceDismissed < 7) {
        return;
      }
    }

    // Show popup after 10 seconds
    const showTimer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(showTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("arcure-newsletter-dismissed", "true");
    localStorage.setItem("arcure-newsletter-dismissed-time", Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    localStorage.setItem("arcure-newsletter-subscribed", "true");

    // Close after 2 seconds
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 hover:bg-gray-100 text-gray-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Left Side - Image */}
          <div className="relative h-64 md:h-auto bg-gradient-to-br from-teal-600 to-teal-800">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  <Tag className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-4xl font-bold mb-4 leading-tight">
                  Get 10% OFF
                </h3>
                <p className="text-xl text-teal-100 mb-4">
                  on your first order!
                </p>
                <div className="flex items-center justify-center gap-2 text-teal-100">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Limited Time Offer</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-10">
            {!isSuccess ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Join Our Newsletter
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Subscribe to receive exclusive offers, health tips, and be the
                  first to know about new products.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="newsletter-email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="newsletter-email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Subscribing...
                      </span>
                    ) : (
                      "Get My 10% Discount"
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-teal-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="leading-relaxed">
                      We respect your privacy. Unsubscribe anytime. No spam, just
                      health tips and exclusive deals.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Welcome to Arcure Pharma! 🎉
                </h3>
                <p className="text-gray-600 mb-4">
                  Check your email for your exclusive 10% discount code.
                </p>
                <p className="text-sm text-teal-600 font-semibold">
                  Use code: <span className="text-lg">WELCOME10</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
