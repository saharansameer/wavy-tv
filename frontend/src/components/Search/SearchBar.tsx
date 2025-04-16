import { Input } from "../ui/input";
import { Search, CircleX } from "lucide-react";
import { useState, useRef } from "react";

export default function SearchBar() {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const clearInputHandler = () => {
    setInputText("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full flex flex-row items-center justify-end md:justify-center">
      <div className="relative w-[400px] hidden md:block lg:w-[500px]">
        <Input
          type={"input"}
          placeholder={"Search"}
          className={"w-[400px] hidden md:block lg:w-[500px]"}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          ref={inputRef}
        />
        <button
          className={`${inputText !== "" ? "" : "hidden"} absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer`}
          onClick={clearInputHandler}
        >
          <CircleX style={{ width: "18px", height: "18px" }} />
        </button>
      </div>
      <button className="cursor-pointer bg-primary rounded-3xl md:rounded-[0px] md:rounded-e-3xl h-10 px-4">
        <Search style={{ width: "22px", height: "22px" }} />
      </button>
    </div>
  );
}
