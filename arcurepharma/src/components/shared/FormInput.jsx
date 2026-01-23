import React from "react";

const FormInput = ({
  label,
  id,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  className = "",
  rows,
}) => {
  const isTextArea = type === "textarea";

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label op-7 d-block mb-2">
          {label}
        </label>
      )}
      {isTextArea ? (
        <textarea
          id={id}
          name={name}
          className={`glass-input w-100 ${error ? "is-invalid" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows || 4}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          autoComplete={autoComplete}
          className={`glass-input w-100 ${error ? "is-invalid" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
      {error && <div className="error-text mt-1">{error}</div>}
    </div>
  );
};

export default FormInput;
