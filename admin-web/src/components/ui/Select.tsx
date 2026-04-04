import React from "react";

type Props = {
  children: React.ReactNode;
  name?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className: string;
  isRequired?: boolean;
  isDisabled?: boolean;
};

function Select({
  children,
  name,
  value,
  onChange,
  className,
  isRequired = false,
  isDisabled = false,
}: Props) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      required={isRequired}
      disabled={isDisabled}
    >
      {children}
    </select>
  );
}

export default Select;
