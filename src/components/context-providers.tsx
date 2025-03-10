"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { atom, useAtom } from "jotai";
import { mobileAtom, pwaAtom, userAtom } from "@/components/atoms";
import Image from "next/image";
import { User } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import useDeviceType from "@/hooks/useDeviceType";
import appConfig from "@/app.config";
import HashLoader from "@/components/ui/hash-loader";
import { useThemeColor } from "@/hooks/useThemeColor";
import { asyncDelay } from "@/utils";
import useIsPWAInstalled from "@/hooks/useIsPWAInstalled";
import { WorkloadProvider } from "@/components/global-workload";

export interface ContextProvidersProps extends ThemeProviderProps {
  user: User | null;
}

export const SplashScreenTrackerAtom = atom(true);

export function ContextProviders({
  children,
  user,
  ...props
}: ContextProvidersProps) {
  const [isSplashVisible, setSplashVisible] = useAtom(SplashScreenTrackerAtom);

  const { isMobile } = useDeviceType();
  const isPWAInstalled = useIsPWAInstalled();

  const [userState, setUserState] = useAtom(userAtom);
  const [mobile, setMobile] = useAtom(mobileAtom);
  const [pwaInstalled, setPwaInstalled] = useAtom(pwaAtom);

  React.useEffect(() => {
    // Ensure the splash screen stays visible for at least 3000ms
    (async () => {
      await asyncDelay(3000);
      setSplashVisible(false);
    })();
  }, []);

  React.useEffect(() => {
    // Prevent scrolling when splash screen is visible
    if (isSplashVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup to avoid side effects
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSplashVisible]);

  React.useEffect(() => {
    // Load the data
    if (isMobile !== mobile) setMobile(isMobile);
    if (user !== userState) setUserState(user);
    if (isPWAInstalled !== pwaInstalled) setPwaInstalled(isPWAInstalled);
  }, [isMobile, user, isPWAInstalled]);

  React.useEffect(() => {
    if (mobile) {
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
    } else {
      document.body.style.webkitUserSelect = "auto";
      document.body.style.userSelect = "auto";
    }
  }, [mobile]);

  return (
    <NextThemesProvider {...props}>
      <WorkloadProvider>
        <TooltipProvider>
          {children}
          {isSplashVisible && (
            <section className="relative">
              <SplashScreen />
            </section>
          )}
        </TooltipProvider>
      </WorkloadProvider>
    </NextThemesProvider>
  );
}

function SplashScreen() {
  const foregroundColor = useThemeColor("foreground");
  const [isFadingOut, setFadingOut] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setFadingOut(true), 3000 - 300); // Start fade-out before 3000ms
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="bg-background no-js-hide fixed inset-0 flex flex-col items-center justify-center gap-y-4 z-50 transition-opacity duration-300"
      style={
        isFadingOut ? { opacity: 0, pointerEvents: "none" } : { opacity: 1 }
      }
    >
      <Image
        src={appConfig.icons.icon}
        alt="Pixelle"
        height={200}
        width={200}
        className="size-40 animate-deep-pulse"
      />
      <HashLoader color={foregroundColor} size={50} />
    </section>
  );
}
