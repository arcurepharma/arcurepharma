"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, User, LogOut, Package, Leaf, Anchor } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useTheme } from "@/lib/ThemeProvider";

interface NavUser {
  id: string;
  name: string;
  email: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const totalItems = useCartStore((s) => s.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserOpen(false);
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#products", label: "Products" },
    { href: "/reviews", label: "Reviews" },
    { href: "/#about", label: "About Us" },
  ];

  const userInitial = (user?.name || user?.email || "U").charAt(0).toUpperCase();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Main header */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "top-0 bg-white/95 backdrop-blur-md shadow-lg shadow-black/5"
            : "top-0 bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
              <Image
                src="/logo-arcure.jpg"
                alt="Arcure Pharma"
                width={180}
                height={45}
                priority
                className="h-8 sm:h-10 lg:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative px-4 py-2 text-[13px] font-semibold text-gray-600 hover:text-teal-700 transition-colors uppercase tracking-wide"
                >
                  {link.label}
                  <span className="absolute left-4 right-4 bottom-0 h-[2px] bg-teal-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                title={theme === "green" ? "Switch to Navy Blue" : "Switch to Leaf Green"}
                suppressHydrationWarning
                aria-label="Toggle theme"
                className="flex items-center rounded-full bg-gray-100 border border-gray-200 p-1 cursor-pointer transition-colors min-h-[36px] sm:min-h-[44px] shrink-0"
              >
                <span
                  className={`flex items-center justify-center gap-1 rounded-full px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold transition-all ${
                    theme === "green"
                      ? "bg-teal-600 text-white shadow"
                      : "text-gray-500 hover:text-teal-700"
                  }`}
                >
                  <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Green</span>
                </span>
                <span
                  className={`flex items-center justify-center gap-1 rounded-full px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold transition-all ${
                    theme === "navy"
                      ? "bg-[#1f407a] text-white shadow"
                      : "text-gray-500 hover:text-[#1f407a]"
                  }`}
                >
                  <Anchor className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Navy</span>
                </span>
              </button>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-1.5 px-1.5 sm:px-2.5 py-1.5 sm:py-2 bg-gray-50 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors border border-gray-100 min-h-[36px] sm:min-h-[44px]"
                  >
                    <div className="w-5 h-5 sm:w-7 sm:h-7 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                      {userInitial}
                    </div>
                    <span className="text-xs font-semibold text-gray-600 hidden sm:inline truncate max-w-[60px]">
                      {user.name?.split(" ")[0] || "Account"}
                    </span>
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-800 text-xs sm:text-sm truncate">
                          {user.name || "My Account"}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        <Package className="w-4 h-4 text-teal-600" />
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-1.5 px-2 sm:px-4 py-2 sm:py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all hover:shadow-lg hover:shadow-teal-600/25 active:scale-95 min-h-[44px]"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">Sign In</span>
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/checkout"
                className="relative p-1.5 sm:p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors border border-gray-100 min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-5 sm:h-5 bg-teal-500 text-white text-[8px] sm:text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
              >
                {isOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t shadow-xl animate-slide-down">
            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2">
              {!user && (
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 mb-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-colors min-h-[44px]"
                >
                  <User className="w-5 h-5" />
                  Sign In / Register
                </Link>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors font-medium text-sm min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    href="/account"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg font-medium text-sm min-h-[44px] flex items-center transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm min-h-[44px] flex items-center transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
