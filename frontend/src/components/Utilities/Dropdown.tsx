import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";
import {
  AlertOverlay,
  DrawerOverlay,
  PostForm,
  CommentForm,
} from "@/components";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

interface DropdownProps {
  data: any;
  entity: "post" | "comment";
}

export function Dropdown({ data, entity }: DropdownProps) {
  const isPost = entity === "post";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-10">
        <DrawerOverlay
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                document.body.removeAttribute("style");
                e.preventDefault();
              }}
            >
              <Pencil />
              Edit
            </DropdownMenuItem>
          }
          title={isPost ? "Edit Post" : "Edit Comment"}
          form={
            isPost ? (
              <PostForm mode="patch" data={data} postPublicId={data.publicId} />
            ) : (
              <CommentForm
                mode="patch"
                data={data}
                commentId={data._id}
                entity={entity}
                entityPublicId={data._id}
              />
            )
          }
        />

        <AlertOverlay
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                document.body.removeAttribute("style");
                e.preventDefault();
              }}
            >
              <Trash2 /> Delete
            </DropdownMenuItem>
          }
          entityType={entity}
          entityId={isPost ? data.publicId : data._id}
          toast={isPost ? "post-delete" : "comment-delete"}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
