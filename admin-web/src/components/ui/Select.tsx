import React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

function Select({ children, ...props }: Props) {
  return <select {...props}>{children}</select>;
}

export default Select;
