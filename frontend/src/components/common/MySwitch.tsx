import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function MySwitch({ ...props }) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={props?.label}>{props?.label}</Label>
      <Switch
        id={props?.label}
        checked={props?.checked}
        onCheckedChange={props?.onCheckedChange}
        {...props}
      />
    </div>
  );
}
