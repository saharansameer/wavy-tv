import { axios } from "@/app/config/axios";
import { PostCard } from "./PostCard";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LoadingOverlay,
  ScrollToTop,
  EntityComments,
  Separator,
  UnavailablePost,
} from "@/components";

const getPostByPublicId = async (publicId: string) => {
  const response = await axios.get(`/api/v1/post/${publicId}`);
  return response.data.data[0];
};

export function Post() {
  const { publicId } = useParams();
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: ["post", publicId],
    queryFn: () => getPostByPublicId(publicId as string),
  });

  if (isFetching || isLoading) {
    return (
      <>
        <LoadingOverlay />
      </>
    );
  }

  if (isError || error || !data) {
    return <UnavailablePost />;
  }

  return (
    <div className="min-h-48 w-xs sm:w-md lg:w-xl mx-auto px-1 py-2">
      <ScrollToTop />
      <PostCard post={data} solo={true} />

      <Separator label="Comments" />

      {/* Comments */}
      <EntityComments
        entity={"post"}
        entityId={data._id}
        entityPublicId={data.publicId}
      />
    </div>
  );
}
