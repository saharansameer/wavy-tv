import React from "react";
import {
  LoadingOverlay,
  VideoPlayer,
  UserAvatar,
  ScrollToTop,
  VoteButtons,
  AlertOverlay,
  DrawerOverlay,
  VideoForm,
} from "@/components";
import { Button } from "@/components/ui";
import { Dot, Pencil, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { getFormatNumber, getFormatTimestamp } from "@/utils/formatUtils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuthStore from "@/app/store/authStore";

const getVideoByPublicId = async (publicId: string) => {
  const response = await axios.get(`/api/v1/video/${publicId}`);
  return response.data.data[0];
};

export function Video() {
  const { publicId } = useParams();
  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: ["video", publicId],
    queryFn: () => getVideoByPublicId(publicId as string),
  });
  const { authUser } = useAuthStore();

  if (isLoading || isFetching)
    return (
      <>
        <LoadingOverlay />
      </>
    );

  if (isError || error || !data) {
    return <div>Video is private or does not exist</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-1">
      <ScrollToTop />
      <div className="flex flex-col">
        <div className="flex flex-row items-center select-none">
          <UserAvatar
            src={data.owner.avatar}
            alt={data.owner.username}
            className={"size-8"}
          />
          <div className="text-lg font-semibold pl-3 hover:underline cursor-pointer">
            {data.owner.username}
          </div>
          <Dot className="pt-1 text-secondary" />
          <div className="text-sm text-secondary">
            {getFormatTimestamp(data.createdAt)}
          </div>
          <Dot className="pt-1 text-secondary" />
          <div className="text-sm text-secondary">
            {getFormatNumber(data.views)} views
          </div>
        </div>
        <div className="py-1 text-2xl font-bold line-clamp-3 leading-tight">
          {data.title}
        </div>
      </div>

      <VideoPlayer src={data.videoFile.url} poster={data.thumbnail.url} />

      <div className="flex justify-between items-center py-2">
        {/* Buttons - Upvote and Downvote */}
        <div>
          <VoteButtons
            entity={"video"}
            entityPublicId={publicId as string}
            currUserVoteType={data.currUserVoteType}
            upvotes={data.upvotes}
            downvotes={data.downvotes}
          />
        </div>

        {/* Options - Edit and Delete */}
        {data.owner.username === authUser.username && (
          <div className="flex gap-x-4">
            {/* Edit Button */}
            <DrawerOverlay
              trigger={
                <Button variant={"outline"} className="w-10 h-7 shadow-xs">
                  <Pencil />
                </Button>
              }
              form={
                <VideoForm
                  mode={"patch"}
                  videoPublicId={publicId}
                  data={data}
                />
              }
              title={"Modify Video Details"}
            />
            {/* Delete Button */}
            <AlertOverlay
              trigger={
                <Button variant={"destructive"} className="w-10 h-7 shadow-xs">
                  <Trash2 />
                </Button>
              }
              entityType={"video"}
              entityId={data.publicId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
