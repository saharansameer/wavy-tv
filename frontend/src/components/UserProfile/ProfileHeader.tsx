import { axios } from "@/app/config/axios";
import { UserAvatar, ExpandableField, ProfileEditOverlay } from "@/components";
import { Button } from "@/components/ui";
import useAuthStore from "@/app/store/authStore";
import { UserCheck, UserPlus } from "lucide-react";
import { verifyAndGenerateNewToken } from "@/utils/tokenUtils";
import { setQueryInvalid } from "@/utils/reactQueryUtils";
import { showToast } from "@/utils/toast";

export type ProfileHeaderProps = {
  user: {
    fullName: string;
    username: string;
    about: string;
    avatar?: {
      url: string;
    };
    coverImage?: {
      url: string;
    };
    followers: number;
    following: number;
    isOwnProfile: boolean;
    isFollower: boolean;
  };
};

const toggleFollow = async (username: string) => {
  await axios.post(`/api/v1/follow/${username}`);
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { authenticated } = useAuthStore();
  const followButtonHandler = async () => {
    if (!authenticated) return;
    if (!(await verifyAndGenerateNewToken())) return;
    await toggleFollow(user.username);
    showToast("user-follow-toggle");
    await setQueryInvalid({ queryKey: [user.username] });
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-32 sm:h-44 md:h-64 w-full overflow-hidden">
        <img
          src={
            user?.coverImage?.url ||
            "https://res.cloudinary.com/bb-cloud/image/upload/f_auto,q_auto/v1/defaults/nxah7cymd0at1iyqhraf"
          }
          alt="Profile cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info Container */}
      <div className="px-4 md:px-8 pb-4 pt-16 relative">
        {/* Avatar - positioned to overlap the cover image */}
        <div className="absolute -top-12 left-2 md:left-6">
          <div className="rounded-full border-4 border-white overflow-hidden h-24 w-24">
            <UserAvatar
              src={user?.avatar?.url as string}
              altText={user.fullName}
              title={user.fullName}
              className={"w-full h-full object-cover"}
              scale={true}
            />
          </div>
        </div>

        {/* User Info and Action Buttons */}
        <div className="flex flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <p className="text-gray-500">@{user.username}</p>
          </div>

          <div className="flex gap-3">
            {user.isOwnProfile ? (
              <ProfileEditOverlay user={user} />
            ) : user.isFollower ? (
              <Button
                variant={"outline"}
                onClick={followButtonHandler}
                className="font-semibold"
              >
                <UserCheck />
                Following
              </Button>
            ) : (
              <Button
                variant={"default"}
                onClick={followButtonHandler}
                className="font-semibold"
              >
                <UserPlus />
                Follow
              </Button>
            )}
          </div>
        </div>
        {/* About/Bio */}
        {user.about !== "" && (
          <div className="max-w-xs sm:max-w-sm">
            <ExpandableField text={user.about} maxLines={1} userBio={true} />
          </div>
        )}
      </div>
    </div>
  );
}
