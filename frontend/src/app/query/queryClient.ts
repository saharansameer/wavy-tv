import { QueryClient } from "@tanstack/react-query";
import { createIDBPersister } from "./indexedDB";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 10,
      retry: false,
    },
  },
});

const persister = createIDBPersister();
const maxAge = 1000 * 60 * 10;

export { queryClient, persister, maxAge };
