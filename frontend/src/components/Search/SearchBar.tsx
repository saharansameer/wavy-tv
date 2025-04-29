import React from "react";
import { SearchInput, SearchButton } from "@/components";
import { CircleX, X } from "lucide-react";
import useSearchStore from "@/app/store/searchStore";

export function SearchBar() {
  const { inputText, setInputText } = useSearchStore();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const clearInputHandler = () => {
    setInputText("");
    inputRef.current?.focus();
  };

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const mobileInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isSearchOpen) {
      mobileInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <div className="w-full flex flex-row items-center justify-end md:justify-center">
      <div className="relative w-[400px] hidden md:block lg:w-[500px]">
        <SearchInput
          type={"input"}
          placeholder={"Search"}
          className={"w-[400px] hidden md:block lg:w-[500px]"}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
        <button
          className={`${inputText !== "" ? "" : "hidden"} absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer`}
          onClick={clearInputHandler}
        >
          <CircleX style={{ width: "18px", height: "18px" }} />
        </button>
      </div>

      <SearchButton className={"hidden md:block md:rounded-e-3xl"} />

      <SearchButton
        className={"rounded-full md:hidden"}
        onClick={() => setIsSearchOpen(true)}
      />
      {isSearchOpen && (
        <div className="absolute top-0 left-0 w-full z-50 pl-10 md:hidden">
          <div className="backdrop-blur-sm bg-background px-4 py-3">
            <div className="relative gap-2">
              <SearchInput
                type="search"
                placeholder="Search..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                ref={mobileInputRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    mobileInputRef.current?.blur();
                  }
                }}
              />

              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setInputText("");
                }}
                className="p-[1px] absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer md:hidden bg-primary rounded-full"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
