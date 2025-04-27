import React from "react";
import {
  History,
  Upload,
  PencilLine,
  User2,
  ChevronUp,
  SquarePlay,
  Rss,
  ArrowBigUpDash,
  ArrowBigDownDash,
  MessageSquareText,
  Home,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";
import { UserAvatar } from "@/components";
import { Link } from "react-router-dom";
import useAuthStore from "@/app/store/authStore";
import { useLogout } from "@/hooks/useLogout";

interface GroupItem {
  title: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

function SidebarGroupUtil({ groupItems }: { groupItems: GroupItem[] }) {
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="flex flex-col gap-3">
          {groupItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="font-semibold">
                <Link
                  to={item.url}
                  onClick={() => (isMobile ? toggleSidebar() : null)}
                >
                  <item.icon style={{ width: "22px", height: "22px" }} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { isMobile, toggleSidebar } = useSidebar();
  const { authenticated, setAuthOverlayOpen, authUser } = useAuthStore();

  const groupZeroItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Video Feed",
      url: "/vf",
      icon: SquarePlay,
    },
    {
      title: "Post Feed",
      url: "/pf",
      icon: Rss,
    },
  ];

  const groupOneItems = [
    {
      title: "Upload Video",
      url: "/upload",
      icon: Upload,
    },
    {
      title: "Create Post",
      url: "/create",
      icon: PencilLine,
    },
  ];

  const groupTwoItems = [
    {
      title: "Watch History",
      url: "/watchhistory",
      icon: History,
    },
    {
      title: "Upvotes",
      url: "/upvotes",
      icon: ArrowBigUpDash,
    },
    {
      title: "Downvotes",
      url: "/downvotes",
      icon: ArrowBigDownDash,
    },
    {
      title: "Comments",
      url: "/comments",
      icon: MessageSquareText,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        {isMobile && (
          <div className="pb-4">
            <SidebarTrigger className={"fixed inset-x-40 cursor-pointer"} />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="scrollbar-none overflow-x-hidden">
        <SidebarGroupUtil groupItems={groupZeroItems} />
        <SidebarSeparator />
        <SidebarGroupUtil groupItems={groupOneItems} />
        <SidebarSeparator />
        <SidebarGroupUtil groupItems={groupTwoItems} />
        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter className="md:mb-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              {authenticated ? (
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    variant={"outline"}
                    className="cursor-pointer"
                  >
                    <UserAvatar
                      src={authUser.avatar as string}
                      alt={authUser.username}
                    />{" "}
                    <p className="w-40 text-base font-semibold truncate">
                      {authUser.username}
                    </p>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              ) : (
                <SidebarMenuButton
                  variant={"outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setAuthOverlayOpen(true);
                    if (isMobile) {
                      toggleSidebar();
                    }
                  }}
                >
                  <User2 style={{ height: "22px", width: "22px" }} />
                  <span>Login \ Signup</span>
                </SidebarMenuButton>
              )}

              <DropdownMenuContent
                side="top"
                className="w-44 md:w-60 cursor-pointer"
              >
                <DropdownMenuItem>
                  <Button variant={"ghost"} className="h-5 p-0 w-full">
                    Profile
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant={"ghost"} className="h-5 p-0 w-full">
                    Settings
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"ghost"}
                    className="h-5 p-0 w-full"
                    onClick={useLogout}
                  >
                    Log out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
