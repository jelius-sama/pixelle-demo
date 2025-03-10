import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Image from "@/components/layout/image";
import { subtitle } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ArtworkWithUserName } from "@/server/database/fetchUserMetadata";
import { LikeArtButton } from "@/components/layout/like-art";
import { UUID } from "@/server/database/schema";
import MoreOptionsButton from "@/components/layout/more-options";

export default function ArtCard({
  artwork,
  userId,
}: {
  artwork: ArtworkWithUserName;
  userId: UUID | null;
}) {
  return (
    <Card className="relative w-full max-w-[200px]">
      <Link href={`/art/${artwork.id}`} className="group">
        <CardContent className="p-0">
          <Image
            sourceOnError="default"
            src={artwork.images[0]}
            height={200}
            width={200}
            alt="test"
            containerClassName="rounded-t-lg"
            className="w-full h-full max-w-[200px] max-h-[200px] rounded-t-lg aspect-square object-cover"
          />
        </CardContent>
      </Link>

      <CardFooter className="flex flex-col items-start p-2 relative">
        <Link href={`/artist/${artwork.artist_uid}`}>
          <CardDescription className="truncate block w-full max-w-[calc(200px_-_(8px_*_2))]">
            {artwork.artist_user_name}
          </CardDescription>
        </Link>

        <Link href={`/art/${artwork.id}`}>
          <p
            className={subtitle({
              className:
                "text-foreground my-0 truncate text-base lg:text-base block w-full md:w-full max-w-[calc(200px_-_(8px_*_2))]",
            })}
          >
            {artwork.title}
          </p>
        </Link>

        <span className="absolute -top-1 right-0 transform -translate-y-full w-[58px] flex items-center justify-center">
          <MoreOptionsButton
            className="rounded-full size-8 [&_svg]:size-4"
            artworkId={artwork.id}
            options={{
              like: undefined,
              saveToList: true,
              dislike: { listOfDislikes: artwork.dislikes || [] },
            }}
            userId={userId}
          />
        </span>

        {userId && (
          <span className="absolute -top-1 left-0 transform -translate-y-full w-[58px] flex items-center justify-center">
            <LikeArtButton
              className="rounded-full size-8 [&_svg]:size-4"
              artworkId={artwork.id}
              userId={userId}
              likes={artwork.likes || []}
            />
          </span>
        )}
      </CardFooter>

      <React.Fragment>
        <span className="absolute top-1 right-0 w-[58px] flex items-center justify-center">
          <Button
            asChild
            variant={"secondary"}
            size={"icon"}
            className="rounded-xl  w-fit px-2 h-6 flex items-center [&_svg]:size-3 [&_p]:text-xs"
          >
            <Link href={`/art/${artwork.id}`}>
              <CopyIcon />
              <p>{artwork.images.length}</p>
            </Link>
          </Button>
        </span>
      </React.Fragment>
    </Card>
  );
}

export function ArtCardSkeleton() {
  return (
    <Card className="w-full max-w-[200px]">
      <CardContent className="p-0 relative overflow-hidden">
        <Skeleton className="overflow-hidden rounded-none rounded-t-lg w-full h-full max-h-[200px] max-w-[200px] aspect-square object-cover" />
        <div className="absolute top-1 bottom-1 right-0 w-[58px] flex flex-col justify-between items-center">
          <span>
            <Button
              variant={"secondary"}
              size={"icon"}
              className="pointer-events-none rounded-xl overflow-hidden w-12 h-6 flex items-center [&_svg]:size-3 [&_p]:text-xs"
            >
              <Skeleton className="w-full h-full rounded-none" />
            </Button>
          </span>
          <span>
            <Button
              variant={"secondary"}
              size={"icon"}
              className="pointer-events-none overflow-hidden rounded-full size-8 [&_svg]:size-4"
            >
              <Skeleton className="w-full h-full rounded-none" />
            </Button>
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-2 gap-y-1">
        <CardDescription className="truncate w-full block">
          <Skeleton className="w-full h-[calc(20px-4px)]" />
        </CardDescription>
        <span className={subtitle({ className: "my-0 truncate md:w-full" })}>
          <Skeleton className="w-full h-[calc(28px-8px)]" />
        </span>
      </CardFooter>
    </Card>
  );
}
