interface Props {
  message?: string;
}

function FieldError({ message }: Props) {
  if (!message) return null;
  return <p className="text-danger mt-1 font-medium">{message}</p>;
}

export default FieldError;
