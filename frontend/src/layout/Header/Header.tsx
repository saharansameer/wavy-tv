import { Theme } from "@/components";

export default function Header() {
  return (
    <div className="h-12 flex flex-row items-center">
      <Theme />
      <img src="/wavytv-logo.png" alt="wavytv" className="w-28 fixed inset-x-15" />
      {/* fixed inset-x-15 inset-y-4 */}
    </div>
  );
}
