import {
  Home,
  UserRound,
  History,
  Save,
  ClockFading,
  ListVideo,
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
  SidebarTrigger
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  const items = [
    {
      title: "Home",
      url: "",
      icon: Home,
    },
    {
      title: "Profile",
      url: "",
      icon: UserRound,
    },
    {
      title: "Playlists",
      url: "",
      icon: ListVideo,
    },
    {
      title: "Saved",
      url: "",
      icon: Save,
    },
    {
      title: "Watch Later",
      url: "",
      icon: ClockFading,
    },
    {
      title: "History",
      url: "",
      icon: History,
    },
  ];
  return (
    <Sidebar>
      <SidebarHeader>
        {isMobile && (
          <div className="pb-4">
            <SidebarTrigger
              className={"fixed inset-x-40 cursor-pointer"}
            />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="font-semibold">
                    <a href={item.url}>
                      <item.icon style={{ width: "22px", height: "22px" }} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
