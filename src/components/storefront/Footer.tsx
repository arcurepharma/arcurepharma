"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight, Clock } from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* About Section */}
      <section id="about" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fdf4f7] text-[#a83866] text-sm font-semibold rounded-full mb-4">
                About Us
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Your Trusted Online{" "}
                <span className="text-[#a83866]">Pharmacy</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Arcure Pharma is dedicated to providing high-quality medicated
                products with the convenience of online ordering and fast doorstep
                delivery. With years of experience in the healthcare industry, we
                ensure every product meets rigorous quality standards.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Our mission is to make essential medications and health products
                accessible to everyone, everywhere across Pakistan.
              </p>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#a83866] hover:bg-[#8a2a52] text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-[#a83866]/25 active:scale-95"
              >
                Explore Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "1,000+", label: "Happy Customers" },
                { value: "4.0", label: "Average Rating" },
                { value: "24/7", label: "Customer Support" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <p className="text-2xl lg:text-3xl font-extrabold text-[#a83866] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#44122a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/logo-arcure.png"
                  alt="Arcure Pharma"
                  width={260}
                  height={65}
                  className="h-16 w-auto object-contain"
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Your trusted partner in health. Quality products, delivered with
                care across Pakistan.
              </p>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", href: "https://www.facebook.com/share/1MJnpFc6QJ/", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                  { label: "TikTok", filled: true, href: "https://www.tiktok.com/@arcure_pharma?_r=1&_t=ZN-99hDpWlC7bq", path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" },
                  { label: "Instagram", href: "https://www.instagram.com/arcurepharma_official?stkn=OHFpc3VpaTVtZDN2", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#6b1f3e] hover:bg-[#a83866] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={social.filled ? "currentColor" : "none"} stroke={social.filled ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={social.path} /></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/#products", label: "Products" },
                  { href: "/reviews", label: "Reviews" },
                  { href: "/#about", label: "About Us" },
                  { href: "/checkout", label: "Checkout" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[#e07aa0] text-sm transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
                Contact Info
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 text-[#e07aa0] shrink-0 mt-0.5" />
                  <span>Plot No. E99/B, Site Super Highway, Karachi, Pakistan</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 text-[#e07aa0] shrink-0" />
                  <a href="tel:+923341169999" className="hover:text-[#e07aa0] transition-colors">
                    +92 334 116 9999
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-[#e07aa0] shrink-0" />
                  <a href="mailto:info@arcurepharma.com" className="hover:text-[#e07aa0] transition-colors">
                    info@arcurepharma.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Clock className="w-4 h-4 text-[#e07aa0] shrink-0" />
                  <span>Mon - Sat: 9:00 AM - 9:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
                Stay Updated
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe for health tips, new products, and exclusive offers.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-[#6b1f3e] border border-[#8a2a52] rounded-xl text-white text-sm placeholder-[#eca0bb] focus:outline-none focus:border-[#e07aa0] transition-colors"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-[#a83866] hover:bg-[#8a2a52] text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
                >
                  Subscribe
                </button>
              </form>
              <div className="mt-6">
                <Link
                  href="#"
                  className="text-gray-500 hover:text-[#e07aa0] text-xs transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#6b1f3e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#eca0bb] text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} Arcure Pharma. All rights reserved.
            </p>
            <p className="text-[#eca0bb]/60 text-xs">
              Created by{" "}
              <span className="text-[#e07aa0] font-semibold">Muhammad Ayan</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
