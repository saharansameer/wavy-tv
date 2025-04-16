import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar, Header } from "./layout";

function App() {
  return (
    <div className="bg-background dark:bg-background">
      <div className="w-full py-2 px-2 bg-background dark:bg-background sticky top-0 shadow-sm dark:shadow-[#252525]">
        <Header />
      </div>

      <div className="flex flex-row w-full max-w-screen mx-auto">
        <div>
          <SidebarProvider>
            <SidebarTrigger className={"fixed inset-y-4 inset-x-2 cursor-pointer"}/>
            <AppSidebar />
          </SidebarProvider>
        </div>
        <div className="w-full px-2 py-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
