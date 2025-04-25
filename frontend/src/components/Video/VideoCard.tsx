import { UserAvatar } from "@/components";
import { Dot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export function VideoCard({ video }) {
  const getViews = (views: number) => {
    if (views < 999) {
      return String(views);
    }

    if (views > 999 && views < 999999) {
      return String(`${views / 1000}k`);
    }

    if (views > 999999 && views < 9999999) {
      return String(`${views / 1000000}M`);
    }
  };

  const getDate = (timestamp: Date) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <div className="w-80 flex flex-col gap-y-2">
      <Link to={`/v/${video.publicId}`} state={{ src: video.videoFile }}>
        <img
          src={video?.thumbnail}
          className={`w-full rounded-sm cursor-pointer hover:rounded-xl transition-all duration-500 ease-in-out  ${video.nsfw ? "blur-xs" : ""}`}
        />
      </Link>

      <div className="flex flex-row">
        <div className="pt-1">
          <UserAvatar
            src={video.owner.avatar}
            alt={video.owner.fullName}
            title={video.owner.username}
          />
        </div>

        <div className="flex flex-col pl-4 select-none">
          <div className="font-semibold line-clamp-2 leading-5">
            {video.title}
          </div>

          <Link to={`/u/${video.owner.username}`}>
            <div className="mt-2 text-sm text-[#252525] dark:text-[#e1e1e1] hover:underline">
              {video.owner.fullName}
            </div>
          </Link>

          <div className="flex flex-row text-[#252525] dark:text-[#e1e1e1]">
            <div className="text-sm">{getViews(video.views)} views</div>
            <Dot />
            <div className="text-sm">{getDate(video.createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
