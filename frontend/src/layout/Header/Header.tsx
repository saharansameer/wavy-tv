import { Theme, SearchBar } from "@/components";

export function Header() {
  return (
    <div className="w-full flex flex-row items-center justify-evenly h-12 sticky top-0">
      <Theme />
      <img
        src="/wavytv-logo.png"
        alt="wavytv"
        className="w-28 fixed inset-x-15 inset-y-4"
      />
      <div className="w-full pl-64 lg:pl-0 pr-2 md:pr-0">
        <SearchBar />
      </div>
    </div>
  );
}
