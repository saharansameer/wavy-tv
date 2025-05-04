import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
} from "@/components/ui";
import { Pencil } from "lucide-react";
import { UpdateUserInfo, UpdateImage, ProfileHeaderProps } from "@/components";

export function ProfileEditOverlay({ user }: ProfileHeaderProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Pencil style={{ width: "16px", height: "16px" }} />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogClose asChild></DialogClose>
        </DialogHeader>
        <Tabs defaultValue="userinfo" className="min-w-40 md:min-w-md">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger className="cursor-pointer" value="userinfo">
              User Info
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="avatar">
              Avatar
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="coverImage">
              Cover Image
            </TabsTrigger>
          </TabsList>

          {/* Update User Info */}
          <TabsContent value="userinfo">
            <UpdateUserInfo user={user} />
          </TabsContent>

          {/* Update Avatar */}
          <TabsContent value="avatar">
            <UpdateImage label={"Avatar"} folder={"avatars"} />
          </TabsContent>
          {/* Update Cover Image */}
          <TabsContent value="coverImage">
            <UpdateImage label={"Cover Image"} folder={"coverImages"} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
