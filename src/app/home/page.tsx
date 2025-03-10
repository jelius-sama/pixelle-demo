import ArtCard from "@/components/layout/art-card";
import PageTitle from "@/components/layout/page-title";
import TagsCarousel from "@/components/layout/tags-carousel";
import { title } from "@/components/primitives";
import MarginedContent from "@/components/ui/margined-content";
import fetchArtworks from "@/server/database/fetchArtwork";
import { getUser } from "@/utils/get-user";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomePage() {
  const data = await fetchArtworks();
  const { user } = await getUser();

  return (
    <MarginedContent>
      <PageTitle className={title({ color: "foreground" })}>Home</PageTitle>

      {/* <TagsCarousel /> */}

      <section className="w-full h-full grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] place-items-center gap-2">
        {data.map((artwork, index) => (
          <ArtCard
            artwork={artwork}
            key={index}
            userId={user ? user.id : null}
          />
        ))}
      </section>
    </MarginedContent>
  );
}
