import React from "react";

type Props = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
  error?: boolean;
};

function Label({ children, required, error, className = "", ...props }: Props) {
  return (
    <label
      {...props}
      className={`text-[0.9rem] font-medium ${error && "text-danger"} ${className}`}
    >
      {children}
      {required && <span className="ml-1 text-danger">*</span>}
    </label>
  );
}

export default Label;
