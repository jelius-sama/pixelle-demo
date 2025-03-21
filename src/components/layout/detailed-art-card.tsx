"use client";

import React from "react";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import CustomImage from "@/components/layout/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { subtitle } from "@/components/primitives";
import { ChevronLeft, ChevronRight, CopyIcon } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAtomValue } from "jotai";
import { mobileAtom, userAtom } from "@/components/atoms";
import { usePathname, useRouter } from "next/navigation";
import { ArtworkWithUserName } from "@/server/database/fetchUserMetadata";
import { Skeleton } from "@/components/ui/skeleton";
import MoreOptionsButton from "@/components/layout/more-options";
import { ArtWork } from "@/server/database/schema";

export default function DetailedArtCard({
  artwork,
  allowDeleteOption
}: {
  artwork: ArtworkWithUserName | Omit<ArtWork, "artist_id">;
  allowDeleteOption?: boolean;
}) {
  const nextBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const prevBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const isMobile = useAtomValue(mobileAtom);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const router = useRouter();
  const buttonsRef = React.useRef<HTMLButtonElement[]>([]);
  const user = useAtomValue(userAtom);
  const pathname = usePathname();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const preventRoutingWhenInteractingWithButton = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();

    const isHovered: boolean = buttonsRef.current.some((button) =>
      button.matches(":hover")
    );

    const isMouseOverButton = (): boolean => {
      const buttons = buttonsRef.current;
      if (!buttons || buttons.length === 0) return false;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      return buttons.some((button) => {
        if (!button) return false;
        const rect = button.getBoundingClientRect();

        return (
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom
        );
      });
    };

    if (isMouseOverButton() || isHovered) {
      event.stopPropagation();
    } else {
      router.push(event.currentTarget.href);
    }
  };

  const setButtonRef = (button: HTMLButtonElement) => {
    if (button && !buttonsRef.current.includes(button)) {
      buttonsRef.current.push(button);
    }
  };

  const [isVisible, setIsVisible] = React.useState(true); // Track if this artwork should be displayed

  React.useEffect(() => {
    function handleArtDeleted(event: Event) {
      const customEvent = event as CustomEvent<{ artId: string }>;
      if (customEvent.detail.artId === String(artwork.id)) {
        setIsVisible(false); // Hide the component when the art is deleted
      }
    }

    window.addEventListener("artDeleted", handleArtDeleted as EventListener);
    return () => window.removeEventListener("artDeleted", handleArtDeleted as EventListener);
  }, [artwork.id]);

  if (!isVisible) return null; // Remove component from the DOM when hidden

  return (
    <Card className="w-full max-w-[400px] h-[300px] relative group rounded-lg overflow-hidden">
      <div className="w-full h-full flex flex-col justify-between items-center">
        <Button
          asChild
          variant={"secondary"}
          size={"icon"}
          className="z-10 absolute top-2 right-4 flex items-center justify-center rounded-xl w-fit px-2 h-6 [&_svg]:size-3 [&_p]:text-xs"
        >
          <Link href={`/art/${artwork.id}`}>
            <CopyIcon />
            <p>
              {current} / {count}
            </p>
          </Link>
        </Button>

        {!isMobile && (
          <React.Fragment>
            <Button
              ref={setButtonRef}
              onClick={() => {
                if (prevBtnRef.current) {
                  prevBtnRef.current.click();
                }
              }}
              disabled={current === 1}
              variant={"secondary"}
              size={"icon"}
              className="z-20 opacity-0 disabled:opacity-0 disabled:group-hover:opacity-50 group-hover:opacity-100 transition-opacity ease-in-out duration-300 absolute top-1/2 transform -translate-y-1/2 left-4 rounded-full p-2 w-auto h-auto [&_svg]:size-4"
            >
              <ChevronLeft />
            </Button>

            <Button
              ref={setButtonRef}
              onClick={() => {
                if (nextBtnRef.current) {
                  nextBtnRef.current.click();
                }
              }}
              disabled={current === count}
              variant={"secondary"}
              size={"icon"}
              className="z-20 opacity-0 disabled:opacity-0 disabled:group-hover:opacity-50 group-hover:opacity-100 transition-opacity ease-in-out duration-300 absolute top-1/2 transform -translate-y-1/2  right-4 rounded-full p-2 w-auto h-auto [&_svg]:size-4"
            >
              <ChevronRight />
            </Button>
          </React.Fragment>
        )}

        <Link
          onClick={preventRoutingWhenInteractingWithButton}
          href={`/art/${artwork.id}`}
          className="w-full h-full basis-4/5"
        >
          <Carousel
            setApi={setApi}
            className="absolute top-0 right-0 left-0 bottom-0 w-full h-full"
          >
            <CarouselContent
              className="w-full h-full ml-0"
              extraClassName="w-full h-full"
            >
              {artwork.images.map((img, index) => (
                <CarouselItem key={index} className="pl-0">
                  <Image
                    className="w-full h-full object-cover"
                    width={400}
                    height={400}
                    src={`/api/proxy?url=${"object/public/" + img.bucket + "/" + img.path}`}
                    alt={"art-title"}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious
              ref={prevBtnRef}
              variant={"secondary"}
              size={"icon"}
              className="hidden"
              icon="chevron"
            />
            <CarouselNext
              ref={nextBtnRef}
              variant={"secondary"}
              size={"icon"}
              className="hidden"
              icon="chevron"
            />
          </Carousel>
        </Link>

        <CardFooter className="z-10 basis-1/5 p-0 px-4 py-2 w-full h-full flex flex-row justify-between items-center bg-background/80 backdrop-saturate-150 backdrop-blur-md antialiased">
          <div className="flex flex-row flex-nowrap items-center">
            <div className="flex flex-row flex-nowrap items-center justify-center gap-x-2">
              {"artist_id" in artwork ? (
                <React.Fragment>
                  <Link
                    className="w-12 h-12"
                    href={`/artist/${artwork.artist_id}`}
                  >
                    <CustomImage
                      sourceOnError={"default"}
                      disableAnimation={true}
                      containerClassName="pointer-coarse:group-active:opacity-100 pointer-fine:group-hover:opacity-100"
                      className="object-cover rounded-full w-12 h-12"
                      width={50}
                      height={50}
                      src={"/assets/default-banner.JPG"}
                      alt={"artist"}
                    />
                  </Link>
                  <span className="flex flex-col">
                    <Link href={`/art/${artwork.id}`}>
                      <p
                        className={subtitle({
                          fullWidth: false,
                          className:
                            "my-0 truncate block text-base lg:text-base w-full md:w-full max-w-[calc(400px_-_((48px_*_2)_+_(32px_*_2)))]",
                        })}
                      >
                        {artwork.title}
                      </p>
                    </Link>

                    <Link href={`/artist/${artwork.artist_id}`}>
                      <CardDescription className="truncate block w-full max-w-[calc(400px_-_((48px_*_2)_+_(32px_*_2)))]">
                        {artwork.artist_user_name}
                      </CardDescription>
                    </Link>
                  </span>
                </React.Fragment>
              ) : (
                <Link href={`/art/${artwork.id}`}>
                  <p
                    className={subtitle({
                      fullWidth: false,
                      className:
                        "my-0 truncate block text-base lg:text-base w-full md:w-full max-w-[calc(400px_-_((48px_*_2)_+_(32px_*_2)))]",
                    })}
                  >
                    {artwork.title}
                  </p>
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-row flex-nowrap items-center">
            <MoreOptionsButton
              artworkId={artwork.id}
              className="[&_svg]:size-5 py-2 px-2 rounded-full "
              userId={user ? user.id : null}
              options={{
                deleteArt: pathname === "/profile" && allowDeleteOption ? {
                  artId: String(artwork.id)
                } : undefined,
                saveToList: true,
                dislike: { listOfDislikes: artwork.dislikes || [] },
                like: { listOfLikes: artwork.likes || [] },
              }}
            />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

export function DetailedArtCardSkeleton() {
  return (
    <Card className="w-full max-w-[400px] h-[300px] relative group rounded-lg overflow-hidden">
      <Skeleton className="w-full h-full" />
    </Card>
  );
}
