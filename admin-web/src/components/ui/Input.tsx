import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge("text-[0.9rem] outline-none", className)}
        {...props}
      />
    );
  },
);

export default Input;
