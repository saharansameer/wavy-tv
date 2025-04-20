import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputWithLabel({ ...props }) {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={props?.label}>{props?.label}</Label>
      <Input
        type={props?.type}
        id={props?.label}
        placeholder={props?.placeholder}
        {...props}
      />
    </div>
  );
}
