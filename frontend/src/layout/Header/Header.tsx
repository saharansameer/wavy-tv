import { Theme, SearchBar } from "@/components";

export default function Header() {
  return (
    <div className="w-full flex flex-row items-center justify-evenly h-12">
      <Theme />
      <img
        src="/wavytv-logo.png"
        alt="wavytv"
        className="w-28 fixed inset-x-15"
      />
      <div className="fixed w-full pl-64 pr-2 md:pr-0">
        <SearchBar />
      </div>
    </div>
  );
}
