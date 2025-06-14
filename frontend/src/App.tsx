import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, Header, AuthOverlay } from "@/layout";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="bg-background">
      <div className="w-full py-2 px-2 bg-background fixed top-0 z-20">
        <Header />
      </div>

      <div className="flex flex-row w-full max-w-screen mx-auto">
        <div>
          <SidebarProvider>
            <SidebarTrigger
              className={"fixed inset-y-4 inset-x-2 cursor-pointer z-20"}
            />
            <AppSidebar />
          </SidebarProvider>
        </div>
        <div className="w-full px-2 py-2 pt-16">
          <Outlet />
          <AuthOverlay />
          <Toaster position="top-center" richColors />
        </div>
      </div>
    </div>
  );
}

export default App;
