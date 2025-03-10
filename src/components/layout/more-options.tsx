"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookmarkIcon,
  HeartCrackIcon,
  HeartIcon,
  LogInIcon,
  MoreVerticalIcon,
  Trash2Icon,
  UserPlus2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkload } from "@/components/global-workload";
import { PredefinedList, UUID } from "@/server/database/schema";
import { HeartCrackFilledIcon, HeartFilledIcon } from "@/components/icons";
import { addToListAtom } from "@/components/layout/add-to-list";
import { useSetAtom } from "jotai";
import { deleteListAtom } from "./deleteList";
import { useRouter } from "next/navigation";

type Options = {
  like?: {
    listOfLikes: PredefinedList[];
  };
  dislike?: {
    listOfDislikes: PredefinedList[];
  };
  deleteList?: {
    listId: string;
  };
  saveToList?: boolean;
  deleteArt?: {
    artId: string;
  }
};

export default function MoreOptionsButton({
  artworkId,
  className,
  options,
  userId,
}: {
  artworkId: bigint | null;
  userId: UUID | null;
  className?: string;
  options: Options;
}) {
  const router = useRouter();

  const setListStatus = useSetAtom(addToListAtom);
  const deleteList = useSetAtom(deleteListAtom);
  const {
    likeOrRemoveLike,
    dislikeOrRemoveDislike,
    likesState,
    dislikesState,
    deleteArtwork
  } = useWorkload();

  const initiallyLiked = useMemo(() => {
    return options.like
      ? options.like.listOfLikes.some((like) => like.uid === userId)
      : false;
  }, [options.like, userId]);

  const initiallyDisliked = useMemo(() => {
    return options.dislike
      ? options.dislike.listOfDislikes.some((dislike) => dislike.uid === userId)
      : false;
  }, [options.dislike, userId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} size={"chip"} className={className}>
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {!userId && (
          <>
            <DropdownMenuItem onClick={() => router.push("/sign-in")}>
              <div className="flex flex-row gap-2 items-center">
                <LogInIcon />
                Sign in
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/sign-up")}>
              <div className="flex flex-row gap-2 items-center">
                <UserPlus2Icon />
                Sign up
              </div>
            </DropdownMenuItem>
          </>
        )}
        {options.like && (
          <DropdownMenuItem
            onClick={() =>
              likeOrRemoveLike(
                // @ts-ignore
                artworkId,
                initiallyLiked
              )
            }
          >
            <div className="flex flex-row gap-2 items-center">
              {/* @ts-ignore */}
              {likesState[artworkId] ?? initiallyLiked ? (
                <HeartFilledIcon className="fill-red-500" />
              ) : (
                <HeartIcon />
              )}
              Like
            </div>
          </DropdownMenuItem>
        )}

        {options.dislike && (
          <DropdownMenuItem
            onClick={() =>
              dislikeOrRemoveDislike(
                // @ts-ignore
                artworkId,
                initiallyDisliked
              )
            }
          >
            <div className="flex flex-row gap-2 items-center">
              {/* @ts-ignore */}
              {dislikesState[artworkId] ?? initiallyDisliked ? (
                <HeartCrackFilledIcon className="fill-blue-500" />
              ) : (
                <HeartCrackIcon />
              )}
              Dislike
            </div>
          </DropdownMenuItem>
        )}

        {options.saveToList && userId && (
          <DropdownMenuItem
            onClick={() =>
              setListStatus({
                isMenuOpen: true,
                itemData: {
                  // @ts-ignore
                  artworkId: artworkId,
                  userId: userId,
                },
              })
            }
          >
            <div className="flex flex-row gap-2 items-center">
              <BookmarkIcon />
              Save to list
            </div>
          </DropdownMenuItem>
        )}

        {options.deleteList && userId && (
          <DropdownMenuItem
            onClick={() => deleteList({ listId: options.deleteList!.listId })}
          >
            <div className="flex flex-row gap-2 items-center text-destructive">
              <Trash2Icon />
              Delete list
            </div>
          </DropdownMenuItem>
        )}

        {options.deleteArt !== undefined && userId && (
          <DropdownMenuItem
            onClick={() => deleteArtwork(options.deleteArt!.artId)}
          >
            <div className="flex flex-row gap-2 items-center text-destructive">
              <Trash2Icon />
              Delete artwork
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
