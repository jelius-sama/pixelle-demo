import { Metadata } from "next";
import NavItem from "@/components/layout/nav-item";
import {
  DatabaseIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LogInIcon,
  LucideImagePlus,
  PlusCircleIcon,
  SettingsIcon,
  User2Icon,
  UserPlus2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { AppleImage } from "next/dist/lib/metadata/types/extra-types";
import { AdminUserMetadata } from "@/types";
import { BottomNavItem } from "@/components/layout/bottomnav";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const startupImage: AppleImage[] = [
  {
    url: "/splash-screens/apple-splash-2048-2732.jpg",
    media:
      "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2732-2048.jpg",
    media:
      "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1668-2388.jpg",
    media:
      "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2388-1668.jpg",
    media:
      "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1536-2048.jpg",
    media:
      "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2048-1536.jpg",
    media:
      "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1488-2266.jpg",
    media:
      "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2266-1488.jpg",
    media:
      "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1640-2360.jpg",
    media:
      "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2360-1640.jpg",
    media:
      "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1668-2224.jpg",
    media:
      "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2224-1668.jpg",
    media:
      "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1620-2160.jpg",
    media:
      "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2160-1620.jpg",
    media:
      "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1290-2796.jpg",
    media:
      "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2796-1290.jpg",
    media:
      "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1179-2556.jpg",
    media:
      "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2556-1179.jpg",
    media:
      "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1284-2778.jpg",
    media:
      "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2778-1284.jpg",
    media:
      "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1170-2532.jpg",
    media:
      "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2532-1170.jpg",
    media:
      "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1125-2436.jpg",
    media:
      "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2436-1125.jpg",
    media:
      "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1242-2688.jpg",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2688-1242.jpg",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-828-1792.jpg",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-1792-828.jpg",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-1242-2208.jpg",
    media:
      "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-2208-1242.jpg",
    media:
      "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-750-1334.jpg",
    media:
      "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-1334-750.jpg",
    media:
      "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
  {
    url: "/splash-screens/apple-splash-640-1136.jpg",
    media:
      "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    url: "/splash-screens/apple-splash-1136-640.jpg",
    media:
      "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
  },
];

export enum PAGES {
  SETTINGS = "/settings",
  BROWSE = "/browse",
  LIBRARY = "/library",
  HOME = "/",
  SIGNUP = "/sign-up",
  SIGNIN = "/sign-in",
  PROFILE = "/profile",
  ART = "/art/[uid]",
  ARTIST = "/artist/[uuid]",
  SEARCH = "/search/[query]",
  LIST = "/list/[listId]",
  POST = "/post-artwork",
}

export type PageKeys = keyof typeof PAGES;

export const IN_DEV: { [key in PageKeys]: boolean | "half" } = {
  SETTINGS: true,
  BROWSE: true,
  LIBRARY: "half",
  HOME: "half",
  SIGNUP: false,
  SIGNIN: false,
  PROFILE: "half",
  ART: "half",
  ARTIST: "half",
  SEARCH: "half",
  LIST: "half",
  POST: "half",
};

export default {
  title: {
    default: "Pixelle",
    template: `%s - Pixelle`,
  },
  applicationName: "Pixelle",
  description:
    "Discover, share, and support art like never before. A vibrant platform for artists and enthusiasts.",
  icons: {
    icon: "/assets/icon.png",
    apple: "/assets/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pixelle",
    startupImage: startupImage,
  },
} satisfies Metadata;

export const cssVars = {
  headerPx: 40,
  marginPx: 16,
  navHeaderPx: 44,
  navItemsMarginPx: 16,
} as const;

const NavIndex = {
  HOME: 0,
  BROWSE: 1,
  LIBRARY: 2,
  POST: 3,
  ADMIN: 4,
  PROFILE: 5,
  AUTH: 6,
  SETTINGS: 7,
} as const;

type NavIndex = keyof typeof NavIndex;

const BottomNavIndex = {
  HOME: 0,
  BROWSE: 1,
  POST: 2,
  LIBRARY: 3,
  // ADMIN: 4,
  SETTINGS: 4,
} as const;

type BottomNavIndex = keyof typeof BottomNavIndex;

export const getNavItems = (
  user: User | null,
  avatar_url: Promise<string | null>
): Record<NavIndex, JSX.Element | null> => ({
  HOME: <NavItem href="/" title="Home" icon={<HomeIcon />} />,

  BROWSE: (
    <NavItem href="/browse" title="Browse" icon={<LayoutDashboardIcon />} />
  ),

  LIBRARY: user ? (
    <NavItem href="/library" title="Library" icon={<LayoutGridIcon />} />
  ) : null,

  POST: user ? (
    <NavItem href="/post-artwork" title="Post Art" icon={<LucideImagePlus />} />
  ) : null,

  ADMIN:
    user && (user.user_metadata as AdminUserMetadata).is_admin === true ? (
      <NavItem
        href="/admin"
        title="Admin"
        icon={
          <Avatar className="bg-transparent size-6 rounded-none">
            <Suspense fallback={<Skeleton className="rounded-full size-6" />}>
              <LoadAvatarImage withData={{ image: avatar_url, user: user }} />
            </Suspense>

            <AvatarFallback className="bg-transparent rounded-none">
              <DatabaseIcon />
            </AvatarFallback>
          </Avatar>
        }
      />
    ) : null,

  PROFILE: user ? (
    <NavItem
      href="/profile"
      title="Profile"
      icon={
        <Avatar className="bg-transparent size-6 rounded-none">
          <Suspense fallback={<Skeleton className="rounded-full size-6" />}>
            <LoadAvatarImage withData={{ image: avatar_url, user: user }} />
          </Suspense>

          <AvatarFallback className="bg-transparent rounded-none">
            <User2Icon />
          </AvatarFallback>
        </Avatar>
      }
    />
  ) : null,

  AUTH: !user ? (
    <>
      <NavItem href="/sign-in" title="Sign in" icon={<LogInIcon />} />
      <NavItem href="/sign-up" title="Sign up" icon={<UserPlus2Icon />} />
    </>
  ) : null,

  SETTINGS: (
    <NavItem href="/settings" title="Settings" icon={<SettingsIcon />} />
  ),
});

export const getBottomNavItems = (
  user: User | null,
  avatar_url: Promise<string | null>
): Record<BottomNavIndex, JSX.Element | null> => ({
  HOME: <BottomNavItem href="/" title="Home" icon={<HomeIcon />} />,

  BROWSE: (
    <BottomNavItem
      href="/browse"
      title="Browse"
      icon={<LayoutDashboardIcon />}
    />
  ),

  POST: user ? (
    <BottomNavItem
      href="/post-artwork"
      title="Post Art"
      icon={<PlusCircleIcon />}
    />
  ) : null,

  LIBRARY: user ? (
    <BottomNavItem href="/library" title="Library" icon={<LayoutGridIcon />} />
  ) : null,

  // ADMIN:
  //   user && (user.user_metadata as AdminUserMetadata).is_admin === true ? (
  //     <BottomNavItem
  //       href="/admin"
  //       title="Admin"
  //       icon={
  //         <Avatar className="bg-transparent size-6 rounded-none">
  //           <Suspense fallback={<Skeleton className="rounded-full size-6" />}>
  //             <LoadAvatarImage withData={{ image: avatar_url, user: user }} />
  //           </Suspense>

  //           <AvatarFallback className="bg-transparent rounded-none">
  //             <DatabaseIcon />
  //           </AvatarFallback>
  //         </Avatar>
  //       }
  //     />
  //   ) : null,

  SETTINGS: (
    <BottomNavItem href="/settings" title="Settings" icon={<SettingsIcon />} />
  ),
});

export const creator = {
  github: "",
  twitter: "",
  twitterHandle: "@OtakuBoy00701",
};

export async function LoadAvatarImage({
  withData,
}: {
  withData: { image: Promise<string | null>; user: User };
}) {
  const avatar_url = await withData.image;

  return (
    <AvatarImage
      className="bg-transparent size-6 rounded-full"
      src={`${avatar_url}`}
      width={24}
      height={24}
      alt={withData.user.user_metadata.user_name || "admin_user"}
    />
  );
}
