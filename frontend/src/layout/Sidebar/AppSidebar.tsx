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
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import useAuthStore from "@/app/store/authStore";

interface GroupItem {
  title: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

function SidebarGroupUtil({
  groupItems,
  groupLabel,
}: {
  groupItems: GroupItem[];
  groupLabel: string;
}) {
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
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
  const { authenticated, setAuthOverlayOpen } = useAuthStore();

  const groupZeroItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
  ];

  const groupOneItems = [
    {
      title: "Video Feed",
      url: "/vf",
      icon: SquarePlay,
    },
    {
      title: "Upload Video",
      url: "/upload",
      icon: Upload,
    },
  ];

  const groupTwoItems = [
    {
      title: "Post Feed",
      url: "/pf",
      icon: Rss,
    },
    {
      title: "Create Post",
      url: "/create",
      icon: PencilLine,
    },
  ];

  const groupThreeItems = [
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
        <SidebarGroupUtil groupItems={groupZeroItems} groupLabel={"General"} />
        <SidebarSeparator />
        <SidebarGroupUtil groupItems={groupOneItems} groupLabel={"Video"} />
        <SidebarSeparator />
        <SidebarGroupUtil groupItems={groupTwoItems} groupLabel={"Post"} />
        <SidebarSeparator />
        <SidebarGroupUtil
          groupItems={groupThreeItems}
          groupLabel={"Activity"}
        />
      </SidebarContent>
      <SidebarFooter className="md:mb-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              {authenticated ? (
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 style={{ height: "22px", width: "22px" }} /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              ) : (
                <SidebarMenuButton
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
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
