import { QueryClient } from "@tanstack/react-query";
import { createIDBPersister } from "./indexedDB";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
    },
  },
});

const persister = createIDBPersister();

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

export default queryClient;
