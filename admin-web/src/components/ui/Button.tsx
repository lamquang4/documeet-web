import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, className = "", ...props }: Props) {
  return (
    <button className={`btn-hover-scale ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
