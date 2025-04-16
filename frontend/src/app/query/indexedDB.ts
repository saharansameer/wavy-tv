import { get, set, del } from "idb-keyval";
import { PersistedClient } from "@tanstack/react-query-persist-client";

export const createIDBPersister = (key: IDBValidKey = "reactQuery") => {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(key, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(key);
    },
    removeClient: async () => {
      await del(key);
    },
  };
};
