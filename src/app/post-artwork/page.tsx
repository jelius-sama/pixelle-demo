import { cssVars } from "@/app.config";
import PageTitle from "@/components/layout/page-title";
import PostView from "@/components/layout/post-view";
import { title } from "@/components/primitives";
import MarginedContent from "@/components/ui/margined-content";
import { createServerClient } from "@/server/supabase/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Post artwork",
};

export default async function PostPage() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return notFound();

  return (
    <React.Fragment>
      <MarginedContent removeBottomMargin={true}>
        <PageTitle className={title({ color: "foreground" })}>
          Post Art
        </PageTitle>
      </MarginedContent>

      <MarginedContent
        removeTopMargin={true}
        style={{ width: `calc(100% - ${cssVars.marginPx * 2})` }}
        className="h-full flex flex-col gap-y-4 items-center justify-center"
      >
        <PostView />
      </MarginedContent>
    </React.Fragment>
  );
}
