import React from "react";
import { VoteButtons, UserAvatar, TextLinkify, Dropdown } from "@/components";
import { Button } from "@/components/ui";
import { Dot, MessageSquareText } from "lucide-react";
import { getFormatTimestamp } from "@/utils/formatUtils";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "@/app/store/authStore";

interface PostCardProps {
  post: any;
  solo?: boolean;
}

export function PostCard({ post, solo = false }: PostCardProps) {
  const navigate = useNavigate();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isClamped, setIsClamped] = React.useState(false);
  const { authUser } = useAuthStore();

  // Line Clamp Logic
  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkClamp = () => {
      setIsClamped(el.scrollHeight > el.clientHeight);
    };

    // initial check (on mount)
    checkClamp();

    // re-check on window resize
    window.addEventListener("resize", checkClamp);

    return () => {
      window.removeEventListener("resize", checkClamp);
    };
  }, [post.content, contentRef]);

  // Read more handler
  const readMoreHandler = () => {
    navigate(`/p/${post.publicId}`);
  };

  return (
    <div className="flex flex-col w-xs sm:w-md lg:w-xl gap-y-2">
      <div className="flex flex-row items-center justify-between select-none">
        {/*Avatar, Username, Timestamp*/}
        <div className="flex flex-row items-center">
          <UserAvatar
            src={post.owner.avatar}
            alt={post.owner.username}
            className={"size-8"}
          />
          <div className="text-lg font-semibold pl-3 hover:underline cursor-pointer">
            <Link to={`/u/${post.owner.username}`}>{post.owner.username}</Link>
          </div>
          <Dot className="pt-1 text-secondary" />
          <div className="text-sm text-secondary">
            {getFormatTimestamp(post.createdAt)}
          </div>
        </div>

        {/*Dropdown Menu*/}
        {authUser.username === post.owner.username && (
          <Dropdown data={post} entity={"post"} />
        )}
      </div>
      <div className="flex flex-col gap-y-10">
        {/* Content */}
        <div className={`${solo ? "" : "relative"} px-2 py-1 rounded-sm`}>
          <div
            ref={contentRef}
            className={`${solo ? "" : "line-clamp-3 leading-normal"}`}
          >
            <TextLinkify text={post.content} />
          </div>

          {isClamped && !solo && (
            <Button
              variant={"link"}
              onClick={readMoreHandler}
              className="absolute bottom-0 translate-y-6 left-2 p-0"
            >
              read more
            </Button>
          )}

          {isClamped && !solo && (
            <div className="absolute bottom-0 left-0 w-full h-4 translate-y-6 bg-gradient-to-t from-accent to-transparent pointer-events-none rounded-b-sm" />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <VoteButtons
            entity={"post"}
            entityPublicId={post.publicId}
            currUserVoteType={post.currUserVoteType}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
          />
          {!solo && (
            <Button
              variant={"outline"}
              onClick={readMoreHandler}
              className="w-16 h-7 px-2 shadow-xs"
            >
              <MessageSquareText />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
