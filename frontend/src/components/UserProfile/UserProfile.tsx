import React from "react";
import {
  LoadingOverlay,
  ProfileHeader,
  ProfileMetrics,
  ContentNavigation,
  VideoGrid,
  PostsList,
} from "@/components";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getUserProfile = async (username: string) => {
  const response = await axios.get(`/api/v1/user/${username}`);
  return response.data.data;
};

export function UserProfile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = React.useState<"videos" | "posts">(
    "videos"
  );

  const { data, isFetching, isLoading, isError, error } = useQuery({
    queryKey: [username],
    queryFn: () => getUserProfile(username as string),
  });

  if (isFetching || isLoading) {
    return (
      <>
        <LoadingOverlay />
      </>
    );
  }

  if (error || isError || !data) return <div>{error?.message}</div>;

  return (
    <div className="max-w-7xl mx-auto bg-background shadow-sm rounded-lg overflow-hidden">
      <ProfileHeader user={data} />
      <ProfileMetrics followers={data.followers} following={data.following} />
      <ContentNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="p-4 md:p-6">
        {activeTab === "videos" ? <VideoGrid /> : <PostsList />}
      </div>
    </div>
  );
}
