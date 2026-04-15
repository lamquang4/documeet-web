import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, ...props }: Props) {
  return <button {...props}>{children}</button>;
}

export default Button;
