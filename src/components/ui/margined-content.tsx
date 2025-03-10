"use client";

import { ReactNode } from "react";
import { cssVars } from "@/app.config";
import { useAtomValue } from "jotai";
import { mobileAtom, pwaAtom } from "@/components/atoms";

interface MarginedContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  removeTopMargin?: boolean | "whenMobile" | "whenNotMobile";
  removeBottomMargin?: boolean;
}

export default function MarginedContent({
  children,
  style,
  removeTopMargin = false,
  removeBottomMargin,
  ...rest
}: MarginedContentProps) {
  const isMobile = useAtomValue(mobileAtom);
  const isPWAInstalled = useAtomValue(pwaAtom);

  const bottom =
    isMobile && isPWAInstalled
      ? removeBottomMargin
        ? removeBottomMargin
        : false
      : true;

  return (
    <div
      style={{
        paddingTop: !removeTopMargin
          ? `${cssVars.headerPx + cssVars.marginPx}px`
          : 0,
        paddingBottom: !bottom
          ? `${cssVars.headerPx + cssVars.marginPx * 3}px`
          : 0,
        margin: `${cssVars.marginPx}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
