import { axios } from "@/app/config/axios";
import { PaginatedList, VideoCard, Separator, PageTitle } from "@/components";

const getVideos: InfiniteQueryFunction = async ({ pageParam }) => {
  const response = await axios.get(`/api/v1/video?page=${pageParam}&limit=12`);
  return response.data.data;
};

export function VideoFeed() {
  return (
    <>
      <PageTitle title="Video Feed"/>
      <Separator />
      <PaginatedList
        queryKey={["videos"]}
        queryFn={getVideos}
        renderItem={(video) => <VideoCard key={video.publicId} video={video} />}
      />
    </>
  );
}
