import React from "react";
import NavLink from "./NavLink";
import { Link } from "react-router-dom";

export default function Navbar({ route }) {
  return (
    <nav className="navbar navbar-expand-lg fixed-top modern-navbar">
      <div className="container-fluid">
        {/* Brand / Logo */}
        <Link className="navbar-brand fw-bold text-uppercase" to="/">
          Arcurepharma
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler custom-toggler collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="toggler-bar bar1"></span>
          <span className="toggler-bar bar2"></span>
          <span className="toggler-bar bar3"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {route &&
              route.map((item, index) => (
                <NavLink
                  key={index}
                  name={item.name}
                  path={item.path}
                  icon={item.icon}
                />
              ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}