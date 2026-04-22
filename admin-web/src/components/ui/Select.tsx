import React from "react";
import { twMerge } from "tailwind-merge";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

function Select({ children, className, ...props }: Props) {
  return (
    <select
      className={twMerge("text-[0.9rem] outline-none", className)}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
