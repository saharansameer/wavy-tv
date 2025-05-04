import { Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { getFormatNumber, getFormatDuration } from "@/utils/formatUtils";

interface WatchHistoryCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  video: any;
}

export function WatchHistoryCard({ video }: WatchHistoryCardProps) {
  return (
    <div className="w-full flex flex-row gap-x-2">
      <div className="relative min-w-60">
        <Link to={`/v/${video.publicId}`}>
          <img
            src={video?.thumbnail.url}
            className={`w-full h-36 rounded-sm cursor-pointer hover:rounded-xl 
          transition-all duration-300 ease-in-out ${video.nsfw ? "blur-xs" : ""}`}
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
        <div className="flex flex-col pl-4 select-none">
          <div className="lg:text-xl font-semibold line-clamp-2 leading-6">
            {video.title}
          </div>

          <div className="flex flex-row py-2">
            <Link to={`/u/${video.owner.username}`}>
              <div className="font-semibold text-sm text-secondary hover:underline">
                {video.owner.fullName}
              </div>
            </Link>
            <Dot />
            <div className="text-sm text-secondary">
              {getFormatNumber(video.views)} views
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
