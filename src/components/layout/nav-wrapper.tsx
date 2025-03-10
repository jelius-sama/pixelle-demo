"use client";

import { useAtomValue } from "jotai";
import React from "react";
import { mobileAtom, pwaAtom } from "@/components/atoms";
import { User } from "@/types";
import Header from "@/components/layout/header";

export default function NavWrapper({
  sideNav,
  bottomNav,
  user,
}: {
  sideNav: React.ReactNode;
  bottomNav: React.ReactNode;
  user: User | null;
}) {
  const isMobile = useAtomValue(mobileAtom);
  const isPwaInstalled = useAtomValue(pwaAtom);

  return isMobile && isPwaInstalled ? (
    <React.Fragment>
      <Header user={user} />
      {bottomNav}
    </React.Fragment>
  ) : (
    <React.Fragment>{sideNav}</React.Fragment>
  );
}
