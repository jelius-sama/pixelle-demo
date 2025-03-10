import PageTitle from "@/components/layout/page-title";
import { title } from "@/components/primitives";
import MarginedContent from "@/components/ui/margined-content";
import React from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Metadata } from 'next';
import { cssVars } from "@/app.config";
import { TabContent } from "./client";

export type BrowseSearchParams = { [key: string]: string | undefined }

export const generateMetadata = async ({ searchParams }: { searchParams: BrowseSearchParams }): Promise<Metadata> => {
  const tab = typeof searchParams !== "undefined" && searchParams["tab"] === "genre" ? "Genre" : "Tags"

  return {
    title: `Browse ${tab}`
  }
}

export default function BrowsePage({ searchParams }: { searchParams: BrowseSearchParams }) {
  const tabOptions = [
    { label: "Tags", value: "tags" },
    { label: "Genre", value: "genre" },
  ];

  return (
    <MarginedContent style={{ height: `calc(100vh - ${(cssVars.navHeaderPx + cssVars.navItemsMarginPx) * 2}px)` }}>
      <PageTitle className={title({ color: "foreground" })}>Browse</PageTitle>
      <div className="w-full flex items-center justify-center">
        <SegmentedControl
          name="tab"
          options={tabOptions}
          defaultValue="tags"
        />
      </div>
      <TabContent searchParams={searchParams} />
    </MarginedContent>
  );
}

