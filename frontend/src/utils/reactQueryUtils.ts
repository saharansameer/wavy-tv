/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, set } from "idb-keyval";
import { PersistedClient } from "@tanstack/react-query-persist-client";
import { queryClient } from "@/app/query/queryClient";

export const updatePersistData = async (queryKey: string[], newData: any) => {
  try {
    // Get persisted client
    const persistedClient = await get<PersistedClient>("reactQuery");

    if (!persistedClient) {
      console.error(
        "useUpdatePersistData: No persisted client found in IndexedDB"
      );
      return false;
    }

    // Find the asset query inside the client
    const assetQuery = persistedClient.clientState.queries.find(
      (query) => JSON.stringify(query.queryKey) === JSON.stringify(queryKey)
    );

    if (!assetQuery || !assetQuery.state.data) {
      console.error(
        "useUpdatePersistData: No 'video' query found in persisted client"
      );
      return false;
    }

    // Update persisted cache with new data
    const updatedData = { ...assetQuery.state.data, ...newData };
    queryClient.setQueryData(queryKey, updatedData);
    assetQuery.state.data = updatedData;

    // Save the updated persistedClient
    await set("reactQuery", persistedClient);

    // Final Response
    return true;
  } catch (error) {
    console.error("updatePersistData Error:", error);
  }
};
