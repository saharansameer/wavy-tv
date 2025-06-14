import { Search } from "lucide-react";

export function SearchButton({
  className,
  ...props
}: {
  className: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={`cursor-pointer bg-primary h-10 px-3 md:px-4 ${className}`}
      {...props}
    >
      <Search style={{ width: "22px", height: "22px", color: "white" }} />
    </button>
  );
}
