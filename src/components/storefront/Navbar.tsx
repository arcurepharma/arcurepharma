"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, User, LogOut, Package, Search } from "lucide-react";
import { useCartStore } from "@/store/cart";

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

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
    { href: "/#products", label: "Shop" },
    { href: "/reviews", label: "Reviews" },
    { href: "/#about", label: "About Us" },
  ];

  const userInitial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <>
      {/* ── Main Header ── */}
      <header
        className={`fixed left-0 right-0 z-50 top-0 transition-all duration-300 bg-white ${
          scrolled ? "shadow-md" : "shadow-sm border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 lg:h-[68px] gap-4">

            {/* Logo — left */}
            <Link href="/" className="shrink-0 group">
              <Image
                src="/logo-arcure.png"
                alt="Arcure Pharma"
                width={160}
                height={40}
                priority
                className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Nav links — center (desktop) */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors group ${
                    pathname === link.href
                      ? "text-[#a83866]"
                      : "text-gray-600 hover:text-[#a83866]"
                  }`}
                >
                  {link.label}
                  <span className={`absolute left-4 right-4 bottom-0 h-[2px] bg-[#a83866] rounded-full transition-transform duration-300 origin-left ${
                    pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto lg:ml-0">

              {/* Search icon */}
              <button
                aria-label="Search"
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search className="w-4 h-4 text-gray-600" />
              </button>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-[#c85882] to-[#a83866] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      {userInitial}
                    </div>
                    <span className="hidden sm:block text-xs font-semibold text-gray-700 max-w-[55px] truncate">
                      {user.name?.split(" ")[0] || "Account"}
                    </span>
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-800 text-sm truncate">{user.name || "My Account"}</p>
                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#fdf4f7] hover:text-[#a83866] transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#a83866]" /> My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#a83866] hover:bg-[#8a2a52] text-white text-xs sm:text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[#a83866]/25 active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/checkout"
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-[#a83866] text-white text-[8px] sm:text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger — mobile */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {!user && (
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 mb-3 px-4 py-3 bg-[#a83866] hover:bg-[#8a2a52] text-white rounded-xl font-bold text-sm transition-colors"
                >
                  <User className="w-4 h-4" /> Sign In / Register
                </Link>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:bg-[#fdf4f7] hover:text-[#a83866] rounded-xl font-semibold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link href="/account" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-600 hover:bg-[#fdf4f7] hover:text-[#a83866] rounded-xl font-semibold text-sm transition-colors">
                    My Orders
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-sm transition-colors">
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
