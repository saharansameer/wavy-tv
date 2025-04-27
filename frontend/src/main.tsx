import { createRoot } from "react-dom/client";
import "./index.css";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, persister, maxAge } from "@/app/query/queryClient.ts";
import { RouterProvider } from "react-router-dom";
import router from "@/app/routes";

createRoot(document.getElementById("root")!).render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister, maxAge }}
  >
    <RouterProvider router={router} />
  </PersistQueryClientProvider>
);
