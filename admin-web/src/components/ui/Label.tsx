import React from "react";

type Props = {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
};

function Label({ htmlFor, children, className }: Props) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}

export default Label;
