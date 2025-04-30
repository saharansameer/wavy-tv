import { UserAvatar } from "@/components";
import { Link } from "react-router-dom";
import useAuthStore from "@/app/store/authStore";

export function AuthUser() {
  const { authUser } = useAuthStore();
  return (
    <div className="flex flex-row items-center select-none">
      <UserAvatar
        src={authUser.avatar}
        alt={authUser.username}
        className={"size-8"}
      />
      <div className="text-lg font-semibold pl-3 hover:underline cursor-pointer">
        <Link to={`/u/${authUser.username}`}>{authUser.username}</Link>
      </div>
    </div>
  );
}
