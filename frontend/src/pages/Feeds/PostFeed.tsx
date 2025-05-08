import { axios } from "@/app/config/axios";
import { PaginatedList, PostCard } from "@/components";

const getPosts: InfiniteQueryFunction = async ({ pageParam }) => {
  const response = await axios.get(`/api/v1/post?page=${pageParam}&limit=12`);
  return response.data.data;
};

export function PostFeed() {
  return (
    <>
      <PaginatedList
        queryKey={["posts"]}
        queryFn={getPosts}
        renderItem={(post) => <PostCard key={post.publicId} post={post} />}
        docDivCn={"flex flex-col items-center gap-y-15"}
      />
    </>
  );
}
