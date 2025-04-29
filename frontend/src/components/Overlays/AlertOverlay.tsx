import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const alertContent = {
  default: {
    title: "Are you absolutely sure ?",
    description:
      "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  },
  video: {
    title: "Delete Video ?",
    description:
      "This action cannot be undone. This will permanently delete the video.",
  },
  post: {
    title: "Delete Post ?",
    description:
      "This action cannot be undone. This will permanently delete the post.",
  },
};

type AlertType = keyof typeof alertContent;

interface AlertOverlayProps {
  trigger: React.ReactNode;
  type: AlertType;
}

export function AlertOverlay({ trigger, type }: AlertOverlayProps) {
  const { title, description } = alertContent[type];
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
