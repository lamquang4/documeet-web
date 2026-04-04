import React from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  isDisabled?: boolean;
};

function Button({
  title,
  children,
  onClick,
  type = "button",
  className,
  isDisabled = false,
}: Props) {
  return (
    <button
      title={title}
      disabled={isDisabled}
      type={type}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

export default Button;
