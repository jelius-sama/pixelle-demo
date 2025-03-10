"use client";

import PageTitle from "@/components/layout/page-title";
import { title } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import MarginedContent from "@/components/ui/margined-content";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function InsideTest() {
  const router = useRouter();
  return (
    <MarginedContent>
      <PageTitle className={title({ color: "foreground" })}>
        InsideTest
      </PageTitle>
      <br />
      <br />

      <Link href={"/test"}>Go to Test Page</Link>
      <Button onClick={() => router.back()}>Go back</Button>
      <Button onClick={() => router.push("/test")}>Go to Test Page</Button>
    </MarginedContent>
  );
}
