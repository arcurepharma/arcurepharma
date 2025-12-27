import React from "react";
import { Link } from "react-router-dom";

export default function NavLink({ name, path, icon, onClick }) {
  // Check if icon is effectively empty/placeholder (like "test")
  const hasIcon = icon && icon !== "test" && icon.trim() !== "";

  return (
    <li className="nav-item">
      <Link className="nav-link px-3" to={path} onClick={onClick}>
        <div className="d-flex align-items-center">
          {hasIcon && (
            <img
              src={icon}
              alt={name}
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
          )}
          <span>{name}</span>
        </div>
      </Link>
    </li>
  );
}