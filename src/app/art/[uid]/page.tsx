import ArtView from "@/components/layout/art-view";
import MarginedContent from "@/components/ui/margined-content";
import fetchArtworks, {
  fetchArtworkById,
  fetchArtworksByArtistId,
} from "@/server/database/fetchArtwork";
import { UUID } from "@/server/database/schema";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

const dataFetcher = async (artId: UUID) => {
  return await fetchArtworkById(artId);
};

export const generateMetadata = async ({
  params,
}: {
  params: { uid: UUID };
}): Promise<Metadata> => {
  const artwork = await dataFetcher(params.uid);

  return {
    title: artwork ? artwork.title : "404 | Art Not Found!",
  };
};

export default async function ArtPage({ params }: { params: { uid: UUID } }) {
  const artwork = await dataFetcher(params.uid);
  if (!artwork) return notFound();

  const [suggestions, otherWorks] = await Promise.all([
    fetchArtworks(),
    fetchArtworksByArtistId(artwork.artist_id),
  ]);

  return (
    <MarginedContent>
      <section className="flex flex-col">
        <ArtView
          artwork={artwork}
          otherWorks={otherWorks}
          suggestions={suggestions}
          style={{
            artFocus: {
              flexBasis: "65%",
            },

            suggestionFocus: {
              flexBasis: "35%",
            },
          }}
        />
      </section>
    </MarginedContent>
  );
}
