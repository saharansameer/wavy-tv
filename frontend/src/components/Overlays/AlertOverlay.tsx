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
import { setQueriesInvalid } from "@/utils/reactQueryUtils";

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
};

type EntityType = keyof typeof entities;

interface AlertOverlayProps {
  trigger: React.ReactNode;
  entityType: EntityType;
  entityId: string;
}

export function AlertOverlay({
  trigger,
  entityType,
  entityId,
}: AlertOverlayProps) {
  const { title, description, deleteReq } = entities[entityType];

  const onContinueClickHandler = async () => {
    await verifyAndGenerateNewToken();
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
