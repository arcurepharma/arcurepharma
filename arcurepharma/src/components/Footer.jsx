import React from "react";
import { Link } from "react-router-dom";
import socialLinks from "../dependencies/socialLinks";
import contactInfo from "../dependencies/contactInfo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6 text-center text-lg-start">
            <Link to="/" className="navbar-logo mb-3 d-inline-block">
              Arcurepharma
            </Link>
            <p className="footer-brand-text mb-4">
              Dedicated to providing quality healthcare solutions and
              innovations needed for a better tomorrow. We combine science and
              compassion to create pharmaceutical solutions that change lives.
            </p>
            <div className="social-links-grid justify-content-center justify-content-lg-start">
              {socialLinks.map((link, index) => {
                let icon;
                const name = link.name.toLowerCase();
                if (name.includes("facebook")) {
                  icon = (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  );
                } else if (name.includes("twitter") || name.includes("x")) {
                  icon = (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  );
                } else if (name.includes("linkedin")) {
                  icon = (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="4.98" cy="4.4" r="2.27" />
                      <path d="M2 7.84h5.96V22H2zM12.22 7.84V22h5.96v-8.12c0-2.18.9-4.24 3.7-4.24 2.76 0 2.87 2.58 2.87 4.4V22h5.96v-10c0-4.94-1.06-8.72-6.84-8.72-2.78 0-4.64 1.53-5.4 2.96h-.08V7.84z" />
                    </svg>
                  );
                } else {
                  icon = (
                    <span style={{ fontSize: "0.8rem", fontWeight: 800 }}>
                      {link.name.substring(0, 2).toUpperCase()}
                    </span>
                  );
                }

                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-v2"
                    title={link.name}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-lg-2 col-md-6 ms-lg-auto text-center text-lg-start">
            <h5 className="footer-title">Quick Links</h5>
            <div className="footer-links-list">
              <Link to="/" className="footer-link-v2">
                Home
              </Link>
              <Link to="/about" className="footer-link-v2">
                About Us
              </Link>
              <Link to="/contact" className="footer-link-v2">
                Contact
              </Link>
              <Link to="/home" className="footer-link-v2">
                Our Products
              </Link>
            </div>
          </div>

          {/* Contact Column */}
          <div className="col-lg-4 col-md-6 text-center text-lg-start">
            <h5 className="footer-title">Contact Info</h5>
            <div className="d-inline-block text-start">
              <div className="footer-contact-item">
                <div className="footer-contact-icon">📍</div>
                <span>
                  {contactInfo.address.line1}, {contactInfo.address.line2}
                </span>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">📞</div>
                <span>{contactInfo.phone.number}</span>
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">✉️</div>
                <span>{contactInfo.email.primary}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copy mb-0">
            &copy; {currentYear}{" "}
            <span className="text-white fw-bold">Arcurepharma</span>. All Rights
            Reserved.
            <span className="mx-2">|</span>
            Made with <span style={{ color: "#ff4d4d" }}>❤</span> for a better
            health.
          </p>
        </div>
      </div>
    </footer>
  );
}
