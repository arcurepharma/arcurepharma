"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, User, Menu } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cartItems = useCartStore((s) => s.items);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      isActive: pathname === "/",
    },
    {
      href: "/#products",
      icon: Search,
      label: "Browse",
      isActive: false,
    },
    {
      href: "/checkout",
      icon: ShoppingCart,
      label: "Cart",
      badge: cartItems.length,
      isActive: pathname === "/checkout",
    },
    {
      href: "/account",
      icon: User,
      label: "Account",
      isActive: pathname === "/account",
    },
  ];

  return (
    <nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-around px-2 py-2 safe-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center min-w-[64px] px-3 py-2.5 rounded-xl transition-all ${
                item.isActive
                  ? "text-teal-600 bg-teal-50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold mt-1 ${
                item.isActive ? "text-teal-700" : ""
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
