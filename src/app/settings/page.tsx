import StillInDevelopment from "@/components/in-dev";
import PageTitle from "@/components/layout/page-title";
import { title } from "@/components/primitives";
import MarginedContent from "@/components/ui/margined-content";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Settings"
};

export default async function SettingsPage() {

    return (
        <MarginedContent>
            <PageTitle className={title({ color: "foreground" })}>
                Settings
            </PageTitle>
                <StillInDevelopment />
        </MarginedContent>
    );
}
