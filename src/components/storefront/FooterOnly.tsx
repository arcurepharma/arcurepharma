"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight, Clock } from "lucide-react";

// Footer without the About Us section â€” used on product pages, etc.
export default function FooterOnly() {
  return (
    <footer className="bg-[#6b1f6d] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo-arcure.png" alt="Arcure Pharma" width={260} height={65} className="h-16 w-auto object-contain" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your trusted partner in health. Quality products, delivered with care across Pakistan.
            </p>
            <div className="flex gap-3">
              {[
                { label: "Facebook", href: "https://www.facebook.com/share/1MJnpFc6QJ/", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                { label: "TikTok", filled: true, href: "https://www.tiktok.com/@arcure_pharma?_r=1&_t=ZN-99hDpWlC7bq", path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" },
                { label: "Instagram", href: "https://www.instagram.com/arcurepharma_official?stkn=OHFpc3VpaTVtZDN2", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z" },
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#a83aaa] hover:bg-[#fcb8fd] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill={social.filled ? "currentColor" : "none"}
                    stroke={social.filled ? "none" : "currentColor"}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  ><path d={social.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/#products", label: "Products" },
                { href: "/reviews", label: "Reviews" },
                { href: "/#about", label: "About Us" },
                { href: "/checkout", label: "Checkout" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#f472d0] text-sm transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-[#f472d0] shrink-0 mt-0.5" />
                <span>Plot No. E99/B, Site Super Highway, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-[#f472d0] shrink-0" />
                <a href="tel:+923341169999" className="hover:text-[#f472d0] transition-colors">+92 334 116 9999</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#f472d0] shrink-0" />
                <a href="mailto:info@arcurepharma.com" className="hover:text-[#f472d0] transition-colors">info@arcurepharma.com</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock className="w-4 h-4 text-[#f472d0] shrink-0" />
                <span>Mon - Sat: 9:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe for health tips, new products, and exclusive offers.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <input type="email" placeholder="Your email address"
                className="w-full px-4 py-3 bg-[#a83aaa] border border-[#d460d6] rounded-xl text-white text-sm placeholder-[#f896e8] focus:outline-none focus:border-[#f472d0] transition-colors"
              />
              <button type="submit" className="w-full px-4 py-3 bg-[#fcb8fd] hover:bg-[#e8a0f0] text-[#6b1f6d] text-sm font-semibold rounded-xl transition-all active:scale-95">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#a83aaa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#f896e8] text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} Arcure Pharma. All rights reserved.
          </p>
          <p className="text-[#f896e8]/60 text-xs">
            Created by <span className="text-[#f472d0] font-semibold">Muhammad Ayan</span>
          </p>
        </div>
      </div>
    </footer>
  );
}



