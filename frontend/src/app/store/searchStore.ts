import { create, StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface SearchStoreType {
  inputText: string;
  setInputText: (text: string) => void;
}

const searchStore: StateCreator<SearchStoreType> = (set) => ({
  inputText: "",
  setInputText: (inputText: string) => set({ inputText }),
});

const useSearchStore = create(
  devtools(
    persist(searchStore, {
      name: "search",
      storage: createJSONStorage(() => localStorage),
    })
  )
);

export default useSearchStore;
