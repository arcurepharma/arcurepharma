import React from "react";
import socialLinks from "../dependencies/socialLinks";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="text-uppercase fw-bold mb-3">Arcurepharma</h5>
            <p className="text-white-50 small">
              Dedicated to providing quality healthcare solutions and innovations needed for a better tomorrow.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <h5 className="text-uppercase fw-bold mb-3">Connect</h5>
            <div className="footer-social-icons">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge rounded-pill bg-light text-dark me-2 text-decoration-none footer-social-link"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <p className="small text-white-50 mt-3 mb-0">
              &copy; {currentYear} Arcurepharma. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
