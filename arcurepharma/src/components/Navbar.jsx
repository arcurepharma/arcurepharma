import React, { useState, useEffect } from "react";
import NavLink from "./NavLink";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar({ route }) {
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <nav className={`modern-navbar-v2 ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link className="navbar-logo" to="/" onClick={closeMenu}>
          Arcurepharma
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          <ul className="nav-list">
            {route &&
              route.map((item, index) => (
                <NavLink
                  key={index}
                  name={item.name}
                  path={item.path}
                  onClick={closeMenu}
                />
              ))}
          </ul>
        </div>

        {/* Cart Button */}
        <div className="nav-cta-desktop">
          <Link
            to="/cart"
            className="btn-cart"
            onClick={closeMenu}
            style={{ position: "relative" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: "block" }}
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`mobile-toggle-v2 ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu-overlay ${isMenuOpen ? "active" : ""}`}>
          <div className="overlay-content">
            <ul className="mobile-nav-list">
              {route &&
                route.map((item, index) => (
                  <li key={index} className="mobile-nav-item">
                    <RouterNavLink
                      to={item.path}
                      onClick={closeMenu}
                      className="mobile-nav-link"
                    >
                      {item.name}
                    </RouterNavLink>
                  </li>
                ))}
            </ul>
            <div className="mobile-cta">
              <Link
                to="/cart"
                className="btn-cart mobile-btn"
                onClick={closeMenu}
                style={{ position: "relative" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ display: "block" }}
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="cart-badge">{getCartCount()}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
