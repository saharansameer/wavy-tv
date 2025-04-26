interface ErrorMessageProps {
  text: string;
  className?: string;
}

export function ErrorMessage({ text, className }: ErrorMessageProps) {
  return <span className={`text-sm text-[#e53434] ${className}`}>{text}</span>;
}
