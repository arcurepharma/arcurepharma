import React, { useState, useRef, useEffect } from "react";

const FormSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  error,
  options = [],
  placeholder = "Select an option",
  disabled = false,
  className = "",
  showSearch = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => (opt.value || opt) === value);

  const filteredOptions = options.filter((opt) => {
    const labelText = opt.labelString || (opt.label || opt).toString();
    return labelText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`mb-3 ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="form-label op-7 d-block mb-2">
          {label}
        </label>
      )}

      <div className={`custom-select-container ${isOpen ? "open" : ""}`}>
        <div
          className={`glass-input custom-select-trigger ${error ? "is-invalid" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={!selectedOption ? "op-5" : ""}>
            {selectedOption
              ? selectedOption.label || selectedOption
              : placeholder}
          </span>
          <div className="arrow"></div>
        </div>

        <div className={`custom-select-options ${isOpen ? "show" : ""}`}>
          {showSearch && options.length > 10 && (
            <div className="custom-select-search">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const optValue = option.value || option;
                const optLabel = option.label || option;
                const isSelected = optValue === value;

                return (
                  <div
                    key={index}
                    className={`custom-select-option ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelect(optValue)}
                  >
                    {optLabel}
                  </div>
                );
              })
            ) : (
              <div className="custom-select-option op-5">No results found</div>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error-text mt-1">{error}</div>}
    </div>
  );
};

export default FormSelect;
