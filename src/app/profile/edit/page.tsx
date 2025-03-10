import { cssVars } from "@/app.config";
import EditProfileForm from "@/components/layout/edit-profile";
import PageTitle from "@/components/layout/page-title";
import { title } from "@/components/primitives";
import MarginedContent from "@/components/ui/margined-content";
import getUserOrRedirect from "@/utils/get-user";
import { Metadata } from "next";
import React, { Fragment } from "react";

export const metadata: Metadata = {
  title: "Edit Profile",
};

export default async function ProfileEditPage() {
  const { user } = await getUserOrRedirect({ redirectTo: "not-found" });

  return (
    <Fragment>
      <MarginedContent removeBottomMargin={true}>
        <PageTitle className={title({ color: "foreground" })}>
          Edit Profile
        </PageTitle>
      </MarginedContent>

      <MarginedContent
        removeTopMargin={true}
        style={{ width: `calc(100% - ${cssVars.marginPx * 2})` }}
        className="h-full flex flex-col gap-y-4 items-center justify-center"
      >
        <EditProfileForm />
      </MarginedContent>
    </Fragment>
  );
}
