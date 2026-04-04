type Props = {
  id?: string;
  value?: string | number;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type:
    | "text"
    | "number"
    | "file"
    | "search"
    | "email"
    | "password"
    | "date"
    | "datetime"
    | "radio";
  className?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  checked?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
};

function Input({
  id,
  value,
  name,
  onChange,
  onFocus,
  onBlur,
  placeholder = "",
  type,
  className,
  isRequired = false,
  isReadOnly = false,
  checked,
  maxLength,
  min,
  max,
}: Props) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      className={className}
      required={isRequired}
      readOnly={isReadOnly}
      maxLength={maxLength}
      min={min}
      max={max}
      {...(type === "file" && {
        accept: "image/png,image/jpeg,image/webp,image/svg+xml",
      })}
      {...(type === "radio" && { checked })}
    />
  );
}

export default Input;
