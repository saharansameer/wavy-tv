import { getFormatNumber } from "@/utils/formatUtils";

type ProfileMetricsProps = {
  followers: number;
  following: number;
};

export function ProfileMetrics({
  followers,
  following,
}: ProfileMetricsProps) {
  return (
    <div className="flex gap-8 px-4 md:px-8 py-4 border-b">
      <div className="flex flex-col">
        <span className="font-semibold text-lg">
          {getFormatNumber(followers)}
        </span>
        <span className="text-gray-500 text-sm">Followers</span>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-lg">
          {getFormatNumber(following)}
        </span>
        <span className="text-gray-500 text-sm">Following</span>
      </div>
    </div>
  );
}
