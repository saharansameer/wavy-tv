import { PaginatedList, Comment, CommentForm } from "@/components";
import { axios } from "@/app/config/axios";
import { QueryFunctionContext } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAuthStore from "@/app/store/authStore";

interface EntityCommentsProps {
  entity: "post" | "video";
  entityId: string;
  entityPublicId?: string;
}

export function EntityComments({
  entity,
  entityId,
  entityPublicId,
}: EntityCommentsProps) {
  const { publicId } = useParams();
  const { authenticated } = useAuthStore();

  // Query Function
  const getEntityComments: InfiniteQueryFunction = async (
    context: QueryFunctionContext<readonly string[], number>
  ) => {
    const response = await axios.get(
      `/api/v1/comment?entity=${entity}&entityId=${entityId}&page=${context.pageParam}&limit=12`
    );
    return response.data.data;
  };

  return (
    <div className="flex flex-col gap-y-5 h-screen">
      {authenticated && (
        <CommentForm
          mode="post"
          entity={entity}
          entityPublicId={entityPublicId as string}
        />
      )}

      <PaginatedList
        queryKey={["comments", publicId as string]}
        queryFn={getEntityComments}
        renderItem={(comment) => (
          <Comment key={comment._id} comment={comment} />
        )}
        mainDivCn={
          entity === "video"
            ? "flex flex-col justify-between w-full h-full px-2"
            : null
        }
        docDivCn={
          entity === "video"
            ? "flex flex-col gap-y-7 w-xs sm:w-sm lg:w-lg"
            : null
        }
      />
    </div>
  );
}
