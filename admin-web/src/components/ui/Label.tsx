import React from "react";

type Props = React.LabelHTMLAttributes<HTMLLabelElement>;

function Label({ children, ...props }: Props) {
  return <label {...props}>{children}</label>;
}

export default Label;
