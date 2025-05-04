import { axios } from "@/app/config/axios";
import { PaginatedList, VideoCard } from "@/components";
import { useParams } from "react-router-dom";
import { QueryFunctionContext } from "@tanstack/react-query";

export function VideoGrid() {
  const { username } = useParams();

  const getUserVideos: InfiniteQueryFunction = async (
    context: QueryFunctionContext<readonly string[], number>
  ) => {
    const response = await axios.get(
      `/api/v1/video?page=${context.pageParam}&limit=12&username=${username}`
    );
    return response.data.data;
  };

  return (
    <>
      <PaginatedList
        queryKey={[username as string, "videos"]}
        queryFn={getUserVideos}
        renderItem={(video) => <VideoCard key={video.publicId} video={video} />}
        docDivCn={"flex flex-wrap justify-center gap-x-10 gap-y-10"}
      />
    </>
  );
}
