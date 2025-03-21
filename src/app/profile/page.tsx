import DetailedArtCard from "@/components/layout/detailed-art-card";
import PageTitle from "@/components/layout/page-title";
import ProfileLayout from "@/components/layout/profile-layout";
import { subtitle } from "@/components/primitives";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import MarginedContent from "@/components/ui/margined-content";
import { SubmitButton } from "@/components/ui/submit-button";
import { fetchArtworksByArtistId } from "@/server/database/fetchArtwork";
import { getAvatarUrl, getBannerUrl } from "@/server/function/createSignedUrl";
import { createServerClient } from "@/server/supabase/server";
import { omit, toastToClient } from "@/utils";
import getUserOrRedirect from "@/utils/get-user";
import { ServerMessageStatus } from "@/utils/Messages";
import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const [{ user }, avatarUrl, bannerUrl] = await Promise.all([
    getUserOrRedirect({ redirectTo: "sign-in" }),
    getAvatarUrl(),
    getBannerUrl(),
  ]);

  const artworks = await fetchArtworksByArtistId(user.id);

  if (user.user_metadata.avatar_file_path) {
    if (avatarUrl === null) {
      toastToClient({
        serverMessage: "Something went wrong when fetching your Avatar.",
        status: ServerMessageStatus.error,
      });
    }
  }

  if (user.user_metadata.banner_file_path) {
    if (bannerUrl === null) {
      toastToClient({
        serverMessage: "Something went wrong when fetching your Banner.",
        status: ServerMessageStatus.error,
      });
    }
  }

  return (
    <MarginedContent>
      <ProfileLayout
        profileData={{
          user_name: user.user_metadata.user_name,
          banner_file_path: user.user_metadata.banner_file_path,
          avatar_file_path: user.user_metadata.avatar_file_path,
        }}
        avatarUrl={avatarUrl}
        bannerUrl={bannerUrl}
      />

      {searchParams && searchParams.error && (
        <Alert
          variant="destructive"
          className="w-full place-self-center max-w-lg my-4"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{searchParams.error}</AlertDescription>
        </Alert>
      )}

      <PageTitle
        className={subtitle({ fullWidth: true, className: "font-semibold" })}
      >
        Your&apos;s Artworks
      </PageTitle>

      {artworks ? (
        <section className="w-full h-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] place-items-center gap-2">
          {artworks.map((art, index) => (
            <DetailedArtCard
              key={index}
              allowDeleteOption={true}
              artwork={omit(art, ["artist_user_name", "artist_id"])}
            />
          ))}
        </section>
      ) : (
        <span>You don&apos;t have any artworks.</span>
      )}

      <div className="w-full items-center flex flex-row justify-center gap-y-2 pt-20 gap-x-4">
        <Button asChild variant={"secondary"}>
          <Link href={"/profile/edit"}>Edit Profile</Link>
        </Button>
        <form>
          <SubmitButton
            variant={"destructive"}
            formAction={async () => {
              "use server";
              const supabase = createServerClient();
              await supabase.auth.signOut();
            }}
          >
            Logout
          </SubmitButton>
        </form>
      </div>
    </MarginedContent>
  );
}
