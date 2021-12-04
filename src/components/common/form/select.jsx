import React from "react";

const Select = ({ name, label, options, error, ...rest }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        name={name}
        id={name}
        {...rest}
        aria-label="select form"
        className="form-control"
      >
        <option value="" disabled>
          Select a genre
        </option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && (
        <div className="alert text-danger px-0 mb-0 fade show">{error}</div>
      )}
    </div>
  );
};

export default Select;
