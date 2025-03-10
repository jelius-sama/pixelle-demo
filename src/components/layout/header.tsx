"use client";

import React, { Suspense, useEffect, useState } from "react";
import appConfig, { cssVars } from "@/app.config";
import { Button } from "@/components/ui/button";
import { LogInIcon, SearchIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { title } from "@/components/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { HeaderTitle } from "@/components/layout/page-title";
import { getAvatarUrl } from "@/server/function/createSignedUrl";
import { Skeleton } from "@/components/ui/skeleton";

export default function Header({
  user,
  sideBarMenuTrigger,
}: {
  user: User | null;
  sideBarMenuTrigger?: React.ReactNode;
}) {
  return (
    <div
      style={{
        height: `${cssVars.headerPx + cssVars.marginPx * 2}px`,
        width: `calc(100% - ${cssVars.marginPx * 2}px)`,
        marginInline: `${cssVars.marginPx}px`,
        paddingBlock: `${cssVars.marginPx}px`,
      }}
      className={`flex no-js-hide flex-row top-0 fixed z-50 bg-background`}
    >
      <span className="flex flex-row gap-x-6 flex-1">
        {sideBarMenuTrigger}
        <Link
          href={"/"}
          className="flex flex-row gap-x-2 items-center select-none"
        >
          <Image
            src={appConfig.icons.icon}
            alt={appConfig.title.default}
            height={cssVars.headerPx}
            width={cssVars.headerPx}
            className="w-8 h-8 aspect-square rounded-md"
          />
          <p
            className={title({ className: "text-xl lg:text-2xl select-none" })}
          >
            {appConfig.title.default}
          </p>
        </Link>
        <HeaderTitle />
      </span>

      <div className="flex flex-row gap-x-4 md:gap-x-6">
        <Button
          asChild
          size={"icon"}
          variant={"outline"}
          className="rounded-full [&_svg]:size-auto"
        >
          <Link href={"/search"}>
            <SearchIcon strokeWidth={2} />
          </Link>
        </Button>

        <AvatarOrSignIn user={user} />
      </div>
    </div>
  );
}

function AvatarOrSignIn({ user }: { user: User | null }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      setAvatarUrl(await getAvatarUrl());
    })();
  }, []);

  if (avatarUrl === undefined) {
    return <Skeleton className="w-10 h-10 rounded-full" />;
  }

  return user ? (
    <Button asChild className="w-10 h-10 rounded-full" variant={"ghost"}>
      <Link href={"/profile"}>
        <Avatar
          className="w-10 h-10 bg-background"
          style={{ border: "2px solid hsl(240, 3.7%, 15.9%)" }}
        >
          <AvatarImage
            src={`${avatarUrl}`}
            width={cssVars.headerPx}
            height={cssVars.headerPx}
            alt={user.user_metadata.user_name}
          />
          <AvatarFallback className="bg-background [&_svg]:size-5">
            <User2Icon className="text-foreground" strokeWidth={2} />
          </AvatarFallback>
        </Avatar>
      </Link>
    </Button>
  ) : (
    <Button
      asChild
      size={"icon"}
      variant={"secondary"}
      className="w-10 h-10 rounded-full [&_svg]:size-auto"
    >
      <Link href={"/sign-in"}>
        <LogInIcon strokeWidth={2} />
      </Link>
    </Button>
  );
}
