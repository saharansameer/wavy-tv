import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputFile({ ...props }) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={props?.label}>{props?.label}</Label>
      <Input id={props?.label} type="file" {...props} />
    </div>
  );
}
