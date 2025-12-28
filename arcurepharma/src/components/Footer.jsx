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
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-v2"
                  title={link.name}
                >
                  {link.icon || (
                    <span style={{ fontSize: "0.8rem", fontWeight: 800 }}>
                      {link.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </a>
              ))}
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
