import { useSearchParams } from "react-router-dom";
import { PaginatedList, VideoCard } from "@/components";
import { QueryFunctionContext } from "@tanstack/react-query";
import { axios } from "@/app/config/axios";

export function SearchResult() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  // Query Function
  const getSearchResult: InfiniteQueryFunction = async (
    context: QueryFunctionContext<readonly string[], number>
  ) => {
    const response = await axios.get(
      `/api/v1/search?query=${query}&type=video&page=${context.pageParam}&limit=12`,
      { withCredentials: false }
    );
    return response.data.data;
  };

  return (
    <div>
      <PaginatedList
        queryKey={["search"]}
        queryFn={getSearchResult}
        renderItem={(video) => <VideoCard key={video.publicId} video={video} />}
      />
    </div>
  );
}
