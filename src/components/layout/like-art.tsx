"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { HeartCrackIcon, HeartIcon } from "lucide-react";
import { HeartCrackFilledIcon, HeartFilledIcon } from "@/components/icons";
import { PredefinedList, UUID } from "@/server/database/schema";
import { useWorkload } from "@/components/global-workload";

export function LikeArtButton({
  artworkId,
  likes,
  userId,
  className,
}: {
  artworkId: bigint;
  likes: PredefinedList[];
  userId: UUID;
  className?: string;
}) {
  const { likeOrRemoveLike, likesState } = useWorkload();

  const initiallyLiked = useMemo(() => {
    return likes.some((like) => like.uid === userId);
  }, [likes, userId]);

  return (
    <Button
      onClick={() => likeOrRemoveLike(artworkId, initiallyLiked)}
      variant={"secondary"}
      size={"chip"}
      className={className}
    >
      {/* @ts-ignore */}
      {likesState[artworkId] ?? initiallyLiked ? (
        <HeartFilledIcon className="fill-red-500" />
      ) : (
        <HeartIcon />
      )}
    </Button>
  );
}

export function DislikeArtButton({
  artworkId,
  dislikes,
  userId,
  className,
}: {
  artworkId: bigint;
  dislikes: PredefinedList[];
  userId: UUID;
  className?: string;
}) {
  const { dislikeOrRemoveDislike, dislikesState } = useWorkload();

  const initiallyDisliked = useMemo(() => {
    return dislikes.some((dislike) => dislike.uid === userId);
  }, [dislikes, userId]);

  return (
    <Button
      onClick={() => dislikeOrRemoveDislike(artworkId, initiallyDisliked)}
      variant={"secondary"}
      size={"chip"}
      className={className}
    >
      {/* @ts-ignore */}
      {dislikesState[artworkId] ?? initiallyDisliked ? (
        <HeartCrackFilledIcon className="fill-blue-500" />
      ) : (
        <HeartCrackIcon />
      )}
    </Button>
  );
}
