import React from "react";
import {
  UserAvatar,
  Dropdown,
  VoteButtons,
  TextLinkify,
  CommentForm,
} from "@/components";
import { Button } from "@/components/ui";
import { getFormatTimestamp } from "@/utils/formatUtils";
import { Link } from "react-router-dom";
import { Dot } from "lucide-react";
import useAuthStore from "@/app/store/authStore";

interface CommentProps {
  comment: any;
  asChild?: boolean;
}

export function Comment({ comment, asChild = false }: CommentProps) {
  const { authUser, authenticated } = useAuthStore();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isClamped, setIsClamped] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showReplies, setShowReplies] = React.useState(false);
  const [replyForm, setReplyForm] = React.useState(false);

  // Line Clamp Logic
  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkClamp = () => {
      if (!isExpanded) {
        setIsClamped(el.scrollHeight > el.clientHeight);
      }
    };

    // initial check (on mount)
    checkClamp();

    // re-check on window resize
    window.addEventListener("resize", checkClamp);

    return () => {
      window.removeEventListener("resize", checkClamp);
    };
  }, [comment.content, contentRef]);

  // Toggle expand/collapse
  const readMoreHandler = () => {
    setIsExpanded((prev) => !prev);
  };

  // Toggle replies visibility
  const toggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  return (
    <div>
      {/*Avatar, Username, Timestamp*/}
      <div className="flex flex-row items-center justify-between select-none gap-y-2">
        <div className="flex flex-row items-center">
          <UserAvatar
            src={comment.owner.avatar}
            alt={comment.owner.username}
            className={"size-8"}
          />
          <div className="text-lg font-semibold pl-3 hover:underline cursor-pointer">
            <Link to={`/u/${comment.owner.username}`}>
              {comment.owner.username}
            </Link>
          </div>
          <Dot className="pt-1 text-secondary" />
          <div className="text-sm text-secondary">
            {getFormatTimestamp(comment.createdAt)}
          </div>
        </div>

        {/*Dropdown Menu*/}
        {authUser.username === comment.owner.username && (
          <Dropdown data={comment} entity={"comment"} />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col w-xs sm:w-sm lg:w-lg gap-y-7">
        <div className="relative px-2 py-1 rounded-sm">
          <div
            ref={contentRef}
            className="leading-normal transition-[max-height] 
            duration-300 ease-in-out overflow-hidden whitespace-pre-line"
            style={
              isExpanded
                ? { maxHeight: contentRef.current?.scrollHeight }
                : { maxHeight: "4.5em" }
            }
          >
            <TextLinkify text={comment.content} />
          </div>

          {isClamped && (
            <>
              {" "}
              {/* Wrap to support conditional gradient */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-accent to-transparent pointer-events-none rounded-b-sm" />
              )}
              <Button
                variant="link"
                onClick={readMoreHandler}
                className="absolute bottom-0 translate-y-6 left-2 p-0"
              >
                {isExpanded ? "show less" : "show more"}
              </Button>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          {/* Upvote/Downvote */}
          <VoteButtons
            entity={"comment"}
            entityPublicId={comment._id}
            currUserVoteType={comment.currUserVoteType}
            upvotes={comment.upvotes}
            downvotes={comment.downvotes}
          />

          <div>
            {/* Replies Button */}
            {comment.hasReplies && (
              <Button variant="link" onClick={toggleReplies} className="p-0">
                {showReplies
                  ? "Hide replies"
                  : `Show replies (${comment.replies.length})`}
              </Button>
            )}

            {/* Toggle Reply Form */}
            {!asChild && authenticated && (
              <Button
                variant={"link"}
                onClick={() => setReplyForm((prev) => !prev)}
                className="w-16 h-7 px-2"
              >
                Reply
              </Button>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {replyForm && (
          <CommentForm
            mode="post"
            entity="comment"
            entityPublicId={comment._id}
          />
        )}

        {/* Replies list */}
        {showReplies && comment.replies && (
          <div className="mt-4 ml-8 space-y-6">
            {comment.replies.map((reply) => (
              <Comment key={reply._id} comment={reply} asChild={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
