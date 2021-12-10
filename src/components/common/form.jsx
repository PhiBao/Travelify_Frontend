import React from "react";

export const Input = ({
  register,
  name,
  label,
  error,
  type = "text",
  spacingClass,
  ...rest
}) => {
  return (
    <>
      <div className={`form-outline ${spacingClass}`}>
        <input
          {...register(name)}
          className={`form-control form-control-lg form__input ${
            error ? "is-invalid" : ""
          }`}
          placeholder=" "
          type={type}
          {...rest}
        />
        <label htmlFor={name} className="form-label form__label">
          {label}
        </label>
      </div>
      <div className="alert text-danger px-0 mb-0 fade show">
        {error?.message}
      </div>
    </>
  );
};

export const Button = ({ label, alignClass, styleClass, ...rest }) => {
  return (
    <div className={`${alignClass} pt-1`}>
      <button
        className={`${styleClass} btn btn-block btn-lg`}
        {...rest}
        type="submit"
      >
        {label}
      </button>
    </div>
  );
};

export const Checkbox = ({ register, name, label, ...rest }) => {
  return (
    <div className="form-check">
      <input
        {...register(name)}
        className="form-check-input"
        type="checkbox"
        value=""
        id={name}
        {...rest}
      />
      <label className="form-check-label" htmlFor={name}>
        {" "}
        {label}{" "}
      </label>
    </div>
  );
};
