import { UserAvatar } from "@/components";
import { Link } from "react-router-dom";
import useAuthStore from "@/app/store/authStore";

interface AuthUserProps {
  className?: string;
}

export function AuthUser({ className }: AuthUserProps) {
  const { authUser, authenticated } = useAuthStore();
  return (
    <>
      {authenticated && (
        <div className={className || "flex flex-row items-center select-none"}>
          <UserAvatar
            src={authUser?.avatar}
            altText={authUser.username}
            className={"size-8"}
          />
          <div className="text-lg font-semibold pl-3 hover:underline cursor-pointer">
            <Link to={`/u/${authUser.username}`}>{authUser.username}</Link>
          </div>
        </div>
      )}
    </>
  );
}
