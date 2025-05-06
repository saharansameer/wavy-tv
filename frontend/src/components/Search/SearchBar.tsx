import React from "react";
import { SearchInput, SearchButton } from "@/components";
import { CircleX, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setQueryInvalid } from "@/utils/reactQueryUtils";

export function SearchBar() {
  const navigate = useNavigate();
  const [inputText, setInputText] = React.useState<string>("");
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

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQueryInvalid({ queryKey: ["search"] });
      navigate(`/search?q=${encodeURIComponent(inputText)}`);
      setInputText("");
    }
  };

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
            onKeyDownHandler(e);
          }}
        />
        <button
          className={`${inputText !== "" ? "" : "hidden"} absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer`}
          onClick={clearInputHandler}
        >
          <CircleX style={{ width: "18px", height: "18px" }} />
        </button>
      </div>

      <SearchButton
        className={"hidden md:block md:rounded-e-3xl"}
        onClick={() => {
          setQueryInvalid({ queryKey: ["search"] });
          navigate(`/search?q=${encodeURIComponent(inputText)}`);
          setInputText("");
        }}
      />

      <SearchButton
        className={"rounded-full md:hidden"}
        onClick={() => setIsSearchOpen(true)}
      />
      {/* On Mobile Screens */}
      <div
        className={`
        absolute top-0 left-7 z-50 md:hidden
        overflow-hidden
        transition-all duration-500 ease-in-out
        ${isSearchOpen ? "w-[calc(100%-25px)] opacity-100" : "w-0 translate-x-full opacity-0"}
        `}
      >
        <div className="bg-background px-4 pb-3 pt-1 w-full">
          <div className="relative flex items-center gap-2">
            <SearchInput
              type="search"
              placeholder="Search..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              ref={mobileInputRef}
              onKeyDown={(e) => {
                onKeyDownHandler(e);
              }}
            />
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setInputText("");
              }}
              className="p-[1px] absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-primary rounded-full transition-opacity duration-200"
              style={{ opacity: isSearchOpen ? 1 : 0 }}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
