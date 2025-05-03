import axios from "axios";
import {
  WatchHistoryCard,
  PaginatedList,
  Separator,
  AlertOverlay,
} from "@/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "@/components/ui";
import { EllipsisVertical } from "lucide-react";

const getWatchHistory: InfiniteQueryFunction = async ({ pageParam }) => {
  const response = await axios.get(
    `/api/v1/history?page=${pageParam}&limit=12`
  );
  return response.data.data;
};

export function WatchHistory() {
  return (
    <div className="w-full h-screen">
      <div className="w-xs flex gap-x-2">
        <h1 className="font-bold text-xl lg:text-3xl">Watch History</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="translate-y-0.5">
              <EllipsisVertical style={{ width: "20px", height: "20px" }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <AlertOverlay
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => {
                    document.body.removeAttribute("style");
                    e.preventDefault();
                  }}
                >
                  Clear
                </DropdownMenuItem>
              }
              entityType={"history"}
              toast={"user-history-delete"}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator />

      <PaginatedList
        queryKey={["watchhistory"]}
        queryFn={getWatchHistory}
        renderItem={(history) => (
          <WatchHistoryCard
            key={history.video.publicId}
            video={history.video}
          />
        )}
      />
    </div>
  );
}
