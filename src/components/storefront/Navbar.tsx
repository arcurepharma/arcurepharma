"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, Pill, User, LogOut, Package, Leaf, Anchor } from "lucide-react";
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
      {/* Announcement bar */}
      <div className="announcement-bar fixed top-0 left-0 right-0 z-[60] py-2 text-center">
        <p className="text-white text-xs sm:text-sm font-medium">
          🎉 Free delivery on orders above Rs. 2,000! &nbsp;|&nbsp; Call us:{" "}
          <a href="tel:+923341169999" className="underline font-bold">
            +92 334 116 9999
          </a>
        </p>
      </div>

      {/* Main header */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "top-0 bg-white/95 backdrop-blur-md shadow-lg shadow-black/5"
            : "top-[36px] bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/30 group-hover:scale-110 transition-transform duration-300">
                <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden xs:flex flex-col sm:flex-row sm:gap-1">
                <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 leading-none tracking-tight">
                  Arcure<span className="text-teal-700">Pharma</span>
                </h1>
                <p className="hidden sm:block text-[10px] text-teal-600 tracking-[0.3em] uppercase font-bold">
                  Quality You Trust
                </p>
              </div>
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
                className="hidden sm:flex items-center gap-1.5 px-2 sm:px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors border border-gray-100 min-h-[44px]"
              >
                {theme === "green" ? (
                  <Leaf className="w-4 h-4 text-teal-600" />
                ) : (
                  <Anchor className="w-4 h-4 text-teal-600" />
                )}
                <span className="text-xs font-semibold text-gray-600 hidden lg:inline">
                  {theme === "green" ? "Green" : "Navy"}
                </span>
              </button>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-1.5 px-2 sm:px-2.5 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors border border-gray-100 min-h-[44px]"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
                className="relative p-2 sm:p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors border border-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 sm:w-5 h-5 text-gray-700" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-teal-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
