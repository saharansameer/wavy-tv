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
import axios from "axios";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import { setQueriesInvalid, setQueryInvalid } from "@/utils/reactQueryUtils";
import { showToast, ToastType } from "@/utils/toast";

const entities = {
  user: {
    title: "Are you absolutely sure ?",
    description:
      "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
    deleteReq: "/api/v1/user",
  },
  video: {
    title: "Delete Video ?",
    description:
      "This action cannot be undone. This will permanently delete the video.",
    deleteReq: "/api/v1/video",
  },
  post: {
    title: "Delete Post ?",
    description:
      "This action cannot be undone. This will permanently delete the post.",
    deleteReq: "/api/v1/post",
  },
  comment: {
    title: "Delete Comment ?",
    description:
      "This action cannot be undone. This will permanently delete the comment.",
    deleteReq: "/api/v1/comment/delete",
  },
  history: {
    title: "Delete Watch History ?",
    description:
      "This action cannot be undone. This will permanently delete your watch history.",
    deleteReq: "/api/v1/history/clear?range=0",
  },
};

type EntityType = keyof typeof entities;

interface AlertOverlayProps {
  trigger: React.ReactNode;
  entityType: EntityType;
  entityId?: string;
  toast: ToastType;
}

export function AlertOverlay({
  trigger,
  entityType,
  entityId,
  toast,
}: AlertOverlayProps) {
  const { title, description, deleteReq } = entities[entityType];

  const onContinueClickHandler = async () => {
    await verifyAndGenerateNewToken();
    showToast(toast);
    if (entityType === "history") {
      await axios.delete(`${deleteReq}`);
      await setQueryInvalid({ queryKey: ["watchhistory"] });
      return;
    }
    await axios.delete(`${deleteReq}/${entityId}`);
    await setQueriesInvalid();
  };

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
          <AlertDialogAction
            className="cursor-pointer"
            onClick={onContinueClickHandler}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
