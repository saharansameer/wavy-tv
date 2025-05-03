import React from "react";
import {
  UserAvatar,
  Dropdown,
  VoteButtons,
  CommentForm,
  ExpandableField,
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
  const [showReplies, setShowReplies] = React.useState(false);
  const [replyForm, setReplyForm] = React.useState(false);

  // Toggle replies visibility
  const toggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  return (
    <div className="border-b-2 rounded-sm p-2">
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
        <ExpandableField text={comment.content} />

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
