"use client";

import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { SplashScreenTrackerAtom } from "@/components/context-providers";
import { userAtom } from "@/components/atoms";

export default function SignupReminder() {
  const isSplashVisible = useAtomValue(SplashScreenTrackerAtom);
  const router = useRouter();
  const pathname = usePathname();
  const user = useAtomValue(userAtom);

  useEffect(() => {
    if (pathname === "/sign-in" || pathname === "/sign-up") return;
    if (!isSplashVisible && !user) {
      const hasVisited = localStorage.getItem("hasVisited");
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      const now = Date.now();

      if (!hasVisited) {
        localStorage.setItem("hasVisited", String(now));

        toast("Sign up to get the full experience!", {
          action: {
            label: "Sign up",
            onClick: () => router.push("/sign-up"),
          },
        });
      }

      if (hasVisited) {
        const lastVisited = parseInt(hasVisited, 10);

        if (now - lastVisited > oneWeekInMs) {
          // More than a week has passed, remind the user again
          toast("Sign up to get the full experience!", {
            action: {
              label: "Sign up",
              onClick: () => router.push("/sign-up"),
            },
          });

          // Update the timestamp to avoid spamming the user
          localStorage.setItem("hasVisited", String(now));
        }
      }
    }
  }, [isSplashVisible]);

  return <></>;
}
