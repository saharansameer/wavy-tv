import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { AuthUser } from "@/components";

interface DrawerOverlayProps {
  trigger: React.ReactNode;
  title: string;
  form: React.ReactElement<{ onClose?: () => void }>;
}

export function DrawerOverlay({ trigger, title, form }: DrawerOverlayProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="px-2 mx-auto w-full max-w-5xl h-full overflow-scroll overflow-y-auto">
          <DrawerHeader className="text-center">
            <DrawerTitle>{<AuthUser className="flex justify-center" />}</DrawerTitle>
            <DrawerDescription>{title}</DrawerDescription>
          </DrawerHeader>
          {React.isValidElement(form)
            ? React.cloneElement(form, { onClose: () => setOpen(false) })
            : form}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
