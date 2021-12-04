import React from "react";

const Input = ({ register, name, label, error, type = "text", ...rest }) => {
  return (
    <>
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        inputRef={register}
        type={type}
        name={name}
        id={name}
        className="form-control"
        {...rest}
      />
      {error && (
        <div className="alert text-danger px-0 mb-0 fade show">
          {error.message}
        </div>
      )}
    </>
  );
};

export default Input;
