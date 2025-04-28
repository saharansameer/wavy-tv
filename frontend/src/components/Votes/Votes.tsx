import React from "react";
import axios from "axios";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { Button } from "@/components/ui";
import useAuthStore from "@/app/store/authStore";
import { Auth } from "@/pages";
import { updatePersistData } from "@/utils/reactQueryUtils";

interface VotesParams {
  entity: string;
  entityPublicId: string;
  currUserVoteType: "UPVOTE" | "DOWNVOTE" | null;
  upvotes: number;
  downvotes: number;
}

export function Votes({
  entity,
  entityPublicId,
  currUserVoteType,
  upvotes,
  downvotes,
}: VotesParams) {
  const { authenticated, authorized, setAuthorized } = useAuthStore();
  const [upvoteCount, setUpvoteCount] = React.useState(upvotes);
  const [downvoteCount, setDownvoteCount] = React.useState(downvotes);
  const [currVote, setCurrVote] = React.useState(currUserVoteType);

  // Updates Data in persisted storage
  React.useEffect(() => {
    (async () => {
      await updatePersistData([entity, entityPublicId], {
        upvotes: upvoteCount,
        downvotes: downvoteCount,
        currUserVoteType: currVote,
      });
    })();
  }, [upvoteCount, downvoteCount, currVote, entity, entityPublicId]);

  // Upvote Button OnClick Handler
  const upvoteOnClickHandler = async () => {
    // Check Auth
    if (!authorized) {
      setAuthorized(false);
    }

    if (!authenticated) {
      return;
    }

    // Send Request on Server
    await axios.get(
      `/api/v1/vote/${entity}?${entity}PublicId=${entityPublicId}&toggle=UPVOTE`
    );

    // Conditional Checks
    if (currVote === null) {
      setUpvoteCount((prev) => prev + 1);
      setCurrVote("UPVOTE");
      return;
    }
    if (currVote === "UPVOTE") {
      setUpvoteCount((prev) => prev - 1);
      setCurrVote(null);
      return;
    }
    if (currVote === "DOWNVOTE") {
      setUpvoteCount((prev) => prev + 1);
      setDownvoteCount((prev) => prev - 1);
      setCurrVote("UPVOTE");
      return;
    }
  };

  // Downvote Button OnClick Handler
  const downvoteOnClickHandler = async () => {
    // Check Auth
    if (!authorized) {
      setAuthorized(false);
    }

    if (!authenticated) {
      return;
    }

    // Send Request on Server
    await axios.get(
      `/api/v1/vote/${entity}?${entity}PublicId=${entityPublicId}&toggle=DOWNVOTE`
    );

    // Conditional Checks
    if (currVote === null) {
      setDownvoteCount((prev) => prev + 1);
      setCurrVote("DOWNVOTE");
      return;
    }
    if (currVote === "DOWNVOTE") {
      setDownvoteCount((prev) => prev - 1);
      setCurrVote(null);
      return;
    }
    if (currVote === "UPVOTE") {
      setDownvoteCount((prev) => prev + 1);
      setUpvoteCount((prev) => prev - 1);
      setCurrVote("DOWNVOTE");
      return;
    }
  };

  return (
    <div className="flex flex-row gap-x-2">
      <Auth>
        <div></div>
      </Auth>
      <Button
        onClick={upvoteOnClickHandler}
        variant={currVote === "UPVOTE" ? "default" : "ghost"}
      >
        <ArrowBigUp />
      </Button>
      <div>{upvoteCount}</div>
      <Button
        onClick={downvoteOnClickHandler}
        variant={currVote === "DOWNVOTE" ? "default" : "ghost"}
      >
        <ArrowBigDown />
      </Button>
      <div>{downvoteCount}</div>
    </div>
  );
}
