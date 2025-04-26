import axios from "axios";
import { PaginatedList, VideoCard } from "@/components";

const getVideos: QueryFunction = async ({ pageParam }) => {
  const response = await axios.get(`/api/v1/video?page=${pageParam}&limit=12`);
  return response.data.data;
};

export function VideoFeed() {
  return (
    <>
      <PaginatedList
        queryKey={["videos"]}
        queryFn={getVideos}
        renderItem={(video) => <VideoCard key={video.publicId} video={video} />}
      />
    </>
  );
}
