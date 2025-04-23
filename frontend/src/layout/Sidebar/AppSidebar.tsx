import React from "react";
import {
  Home,
  History,
  Heart,
  ClockFading,
  ListVideo,
  Upload,
  PencilLine,
} from "lucide-react";
import { Link } from "react-router-dom";

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

interface GroupItem {
  title: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

function SidebarGroupUtil({ groupItems }: { groupItems: GroupItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="flex flex-col gap-3">
          {groupItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="font-semibold">
                <Link to={item.url}>
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
      <SidebarContent>
        <SidebarGroupUtil groupItems={groupOneItems} />
        <SidebarSeparator />
        <SidebarGroupUtil groupItems={groupTwoItems} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
