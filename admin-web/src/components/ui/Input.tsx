import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(
          "text-[0.9rem] outline-none transition-colors",
          className,
          error && "border-red-500 focus:border-red-500",
        )}
        {...props}
      />
    );
  },
);

export default Input;
