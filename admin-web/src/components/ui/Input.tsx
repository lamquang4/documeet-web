type Props = React.InputHTMLAttributes<HTMLInputElement>;

function Input({ ...props }: Props) {
  return <input {...props} />;
}

export default Input;
