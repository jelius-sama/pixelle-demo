import { cssVars, getBottomNavItems } from "@/app.config";
import { User } from "@/types";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAvatarUrl } from "@/server/function/createSignedUrl";

export default function BottomNav({ user }: { user: User | null }) {
  const avatarURL = getAvatarUrl();
  const bottomNavItems = getBottomNavItems(user, avatarURL);

  return (
    <div
      className="fixed no-js-hide flex flex-row items-center justify-between bottom-0 z-50 border-t bg-black/80 backdrop-blur-md"
      style={{
        height: `${cssVars.headerPx + cssVars.marginPx * 3}px`,
        width: "100%",
        padding: `${cssVars.marginPx}px`,
        paddingTop: 0,
      }}
    >
      {Object.values(bottomNavItems).map((item, index) =>
        item ? <React.Fragment key={index}>{item}</React.Fragment> : null
      )}
    </div>
  );
}

export function BottomNavItem({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Button
      asChild
      variant={"ghost"}
      className="flex flex-col items-center justify-center gap-0 py-0 pointer-coarse:active:bg-transparent pointer-coarse:active:text-foreground"
    >
      <Link href={href}>
        {icon}
        <p className="text-xs font-thin w-full max-w-16 truncate">{title}</p>
      </Link>
    </Button>
  );
}
