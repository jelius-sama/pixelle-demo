import DetailedArtCard from "@/components/layout/detailed-art-card";
import PageTitle from "@/components/layout/page-title";
import ProfileLayout from "@/components/layout/profile-layout";
import { subtitle } from "@/components/primitives";
import MarginedContent from "@/components/ui/margined-content";
import fetchArtist from "@/server/database/fetchArtist";
import { UUID } from "@/server/database/schema";
import createSignedUrl from "@/server/function/createSignedUrl";
import { toastToClient } from "@/utils";
import { ServerMessageStatus } from "@/utils/Messages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

const dataFetcher = async (artistId: UUID) => {
  return await fetchArtist(artistId);
};

export const generateMetadata = async ({
  params,
}: {
  params: { uuid: UUID };
}): Promise<Metadata> => {
  const artist = await dataFetcher(params.uuid);

  return {
    title: artist ? artist.user_name : "404 | User Not Found!",
  };
};

export default async function ArtistProfilePage({
  params,
}: {
  params: { uuid: UUID };
}) {
  const data = await dataFetcher(params.uuid);
  if (!data) return notFound();

  const [avatarUrl, bannerUrl] = await Promise.all([
    createSignedUrl(data.avatar_file_path),
    createSignedUrl(data.banner_file_path),
  ]);

  if (data.avatar_file_path) {
    if (avatarUrl === null) {
      toastToClient({
        serverMessage: "Something went wrong when fetching your Avatar.",
        status: ServerMessageStatus.error,
      });
    }

    if (avatarUrl && avatarUrl.error) {
      toastToClient({
        serverMessage: "Failed to fetch your Avatar.",
        status: ServerMessageStatus.error,
      });
    }

    if (avatarUrl && avatarUrl.url === null) {
      toastToClient({
        serverMessage: "Coundn't fetch your Avatar.",
        status: ServerMessageStatus.error,
      });
    }
  }

  if (data.banner_file_path) {
    if (bannerUrl === null) {
      toastToClient({
        serverMessage: "Something went wrong when fetching your Banner.",
        status: ServerMessageStatus.error,
      });
    }

    if (bannerUrl && bannerUrl.error) {
      toastToClient({
        serverMessage: "Failed to fetch your Banner.",
        status: ServerMessageStatus.error,
      });
    }

    if (bannerUrl && bannerUrl.url === null) {
      toastToClient({
        serverMessage: "Coundn't fetch your Banner.",
        status: ServerMessageStatus.error,
      });
    }
  }

  return (
    <MarginedContent>
      <ProfileLayout
        avatarUrl={avatarUrl ? avatarUrl.url : null}
        bannerUrl={bannerUrl ? bannerUrl.url : null}
        profileData={{
          user_name: data.user_name,
          banner_file_path: data.banner_file_path,
          avatar_file_path: data.avatar_file_path,
        }}
      />
      <PageTitle
        className={subtitle({ fullWidth: true, className: "font-semibold" })}
      >
        {data.user_name}&apos;s Artworks
      </PageTitle>
      <section className="w-full h-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] place-items-center gap-2">
        {data.artworks.map((art, index) => (
          <DetailedArtCard key={index} artwork={art} />
        ))}
      </section>
    </MarginedContent>
  );
}
