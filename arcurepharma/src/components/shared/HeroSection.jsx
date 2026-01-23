import React from "react";

const HeroSection = ({
  subtitle,
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <div className={`row justify-content-center mb-5 ${className}`}>
      <div className="col-lg-8 text-center">
        {subtitle && <span className="hero-subtitle">{subtitle}</span>}
        <h1 className="hero-title mb-4">{title}</h1>
        {description && <p className="op-7 lead">{description}</p>}
        {children}
      </div>
    </div>
  );
};

export default HeroSection;
