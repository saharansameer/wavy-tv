import React from "react";
import {
  History,
  Upload,
  PencilLine,
  CircleUserRound,
  ChevronUp,
  SquarePlay,
  Rss,
  UserRound,
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
      url: "/v/feed",
      icon: SquarePlay,
    },
    {
      title: "Post Feed",
      url: "/p/feed",
      icon: Rss,
    },
  ];

  const groupOneItems = [
    {
      title: "Upload Video",
      url: "/v/new",
      icon: Upload,
    },
    {
      title: "Create Post",
      url: "/p/new",
      icon: PencilLine,
    },
  ];

  const groupTwoItems = [
    {
      title: "Profile",
      url: `/u/${authUser.username}`,
      icon: CircleUserRound,
    },
    {
      title: "Watch History",
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
        <SidebarGroupUtil groupItems={groupZeroItems} />
        <SidebarSeparator />
        <SidebarGroupUtil groupItems={groupOneItems} />
        <SidebarSeparator />
        <SidebarGroupUtil groupItems={groupTwoItems} />
      </SidebarContent>
      <SidebarFooter className="md:mb-14">
        <SidebarMenu>
           {/* User Auth Dropdown */}
          <SidebarMenuItem>
            <DropdownMenu>
              {authenticated ? (
                <DropdownMenuTrigger asChild className="shadow-xs">
                  <SidebarMenuButton
                    variant={"outline"}
                    className="cursor-pointer"
                  >
                    <UserAvatar
                      src={authUser.avatar as string}
                      altText={authUser.username}
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
                  <UserRound style={{ height: "22px", width: "22px" }} />
                  <span>Login \ Signup</span>
                </SidebarMenuButton>
              )}

              <DropdownMenuContent
                side="top"
                className="w-44 md:w-60 cursor-pointer"
              >
                <Link to={"/settings"}>
                  <DropdownMenuItem className="cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={useLogout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {/* built by Sameer Saharan */}
          <SidebarMenuItem>
            <div className="flex items-center p-0">
              <p className="text-sm text-primary">built by</p>
              <Button variant="link" className="font-semibold py-0 px-1">
                <Link to={"https://github.com/saharansameer"}>
                  Sameer Saharan
                </Link>
              </Button>
            </div>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

{
  /* <Link
to={"https://github.com/saharansameer"}
className="text-secondary font-semibold cursor-pointer hover:underline"
>
@sameersaharan
</Link> */
}
