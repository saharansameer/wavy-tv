import axios from "axios";
import { PaginatedList, PostCard } from "@/components";
import { useParams } from "react-router-dom";
import { QueryFunctionContext } from "@tanstack/react-query";

export function PostsList() {
  const { username } = useParams();

  const getUserPosts: InfiniteQueryFunction = async (
    context: QueryFunctionContext<readonly string[], number>
  ) => {
    const response = await axios.get(
      `/api/v1/post?page=${context.pageParam}&limit=12&username=${username}`
    );
    return response.data.data;
  };
  return (
    <>
      <PaginatedList
        queryKey={[username as string, "posts"]}
        queryFn={getUserPosts}
        renderItem={(post) => <PostCard key={post.publicId} post={post} />}
        docDivCn={"flex flex-col items-center gap-y-15"}
      />
    </>
  );
}
