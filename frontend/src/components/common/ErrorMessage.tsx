interface ErrorMessageProps {
  text: string;
}

export function ErrorMessage({ text }: ErrorMessageProps) {
  return <span className="text-sm text-[#e53434]">{text}</span>;
}
