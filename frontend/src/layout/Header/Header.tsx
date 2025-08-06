import { Theme, SearchBar } from "@/components";

export function Header() {
  return (
    <div className="w-full flex flex-row items-center justify-evenly h-12 sticky top-0">
      <Theme />
      <div className="absolute left-24">
        <img
          src="/logo.png"
          alt="wavytv"
          className="w-12 fixed inset-x-12 inset-y-2"
        />
        <h1 className="font-bold text-3xl text-foreground hidden sm:block">WavyTV</h1>
      </div>

      <div className="w-full pl-64 lg:pl-0 pr-2 md:pr-0">
        <SearchBar />
      </div>
    </div>
  );
}
