import { UserAvatar } from "@/components";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { getFormatNumber } from "@/utils/formatUtils";

export type UserCardProps = {
  user: {
    fullName: string;
    username: string;
    avatar?: {
      url?: string;
    };
    followers: number;
  };
};

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="flex items-center justify-between gap-x-5 py-4 px-5 rounded-lg border border-border">
      <div className="flex items-center gap-3">
        <div className="rounded-full overflow-hidden h-12 w-12 flex-shrink-0">
          <UserAvatar
            src={user?.avatar?.url as string}
            altText={user.fullName}
            title={user.fullName}
            className="w-full h-full object-cover"
            scale={true}
          />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {user.fullName}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground truncate">
              @{user.username}
            </p>
            <span className="text-sm text-muted-foreground">•</span>
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {getFormatNumber(user.followers)}{" "}
              {user.followers <= 1 ? "follower" : "followers"}
            </p>
          </div>
        </div>
      </div>

      <Link to={`/u/${user.username}`} className="ml-2 flex-shrink-0">
        <Button variant="outline" size="sm" className="gap-1.5">
          <User className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">View Profile</span>
        </Button>
      </Link>
    </div>
  );
}
