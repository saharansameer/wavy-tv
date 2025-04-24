import React from "react";
import {
  Home,
  History,
  Heart,
  ClockFading,
  ListVideo,
  Upload,
  PencilLine,
  User2,
  ChevronUp,
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
import { Link } from "react-router-dom";
import useAuthStore from "@/app/store/authStore";

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
  const { isMobile } = useSidebar();
  const { authenticated, setAuthOverlayOpen } =
    useAuthStore();

  const groupOneItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Create Post",
      url: "/create",
      icon: PencilLine,
    },
    {
      title: "Upload Video",
      url: "/upload",
      icon: Upload,
    },
  ];

  const groupTwoItems = [
    {
      title: "Playlists",
      url: "/playlist",
      icon: ListVideo,
    },
    {
      title: "Favourites",
      url: "/saved",
      icon: Heart,
    },
    {
      title: "Watch Later",
      url: "/playlist/watch-later",
      icon: ClockFading,
    },
    {
      title: "History",
      url: "/history",
      icon: History,
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
        <SidebarGroupUtil groupItems={groupOneItems} />
        <SidebarSeparator />
        <SidebarGroupUtil groupItems={groupTwoItems} />
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
                  onClick={() => setAuthOverlayOpen(true)}
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
