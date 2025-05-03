import { UserAvatar } from "@/components";
import { Dot, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getFormatNumber,
  getFormatTimestamp,
  getFormatDuration,
} from "@/utils/formatUtils";

const iconStyle = {
  width: "16px",
  height: "16px",
};

export function VideoCard({ video }) {
  return (
    <div className="w-80 h-[268px] flex flex-col gap-y-2">
      <div className="relative">
        <Link to={`/v/${video.publicId}`}>
          <img
            src={video?.thumbnail.url}
            className={`w-full h-48 rounded-sm cursor-pointer object-cover hover:scale-105 transition-transform duration-300 ${video.nsfw ? "blur-xs" : ""}`}
          />
        </Link>
        <div
          className="absolute right-1 bottom-1 select-none text-sm font-semibold
        text-[#fff] bg-[#141414] opacity-80 px-1 rounded-xs"
        >
          {getFormatDuration(video.videoFile.duration)}
        </div>
      </div>

      <div className="flex flex-row">
        <div className="pt-1">
          <UserAvatar
            className={"size-10"}
            src={video.owner.avatar}
            alt={video.owner.fullName}
            title={video.owner.username}
          />
        </div>

        <div className="flex flex-col pl-4 select-none">
          <div className="font-semibold line-clamp-2 leading-6">
            {video.title}
          </div>

          <Link to={`/u/${video.owner.username}`}>
            <div className="mt-2 font-semibold text-sm text-secondary hover:underline">
              {video.owner.fullName}
            </div>
          </Link>

          <div className="flex flex-row items-center gap-x-1 text-secondary">
            <Eye style={iconStyle} />
            <div className="text-sm">{getFormatNumber(video.views)} views</div>
            <Dot />
            <Clock style={iconStyle} />
            <div className="text-sm">{getFormatTimestamp(video.createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
