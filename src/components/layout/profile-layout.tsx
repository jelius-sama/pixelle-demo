import Image from "next/image";
import { title } from "@/components/primitives";

export default function ProfileLayout({
  profileData,
  bannerUrl,
  avatarUrl,
}: {
  profileData: {
    banner_file_path: string | undefined;
    user_name: string;
    avatar_file_path: string | undefined;
  };
  bannerUrl: string | null;
  avatarUrl: string | null;
}) {
  return (
    <div className="flex items-center justify-center flex-col flex-nowrap gap-y-4 pb-4">
      {profileData.banner_file_path ? (
        <Image
          alt={profileData.user_name}
          className="rounded-md aspect-[10/4] md:aspect-[10/3] lg:aspect-[10/2] w-screen object-cover bg-muted"
          height={576}
          src={bannerUrl ? bannerUrl : ""}
          width={1024}
        />
      ) : (
        <Image
          alt={profileData.user_name}
          aria-describedby="https://x.com/ArmandoValores/status/1840576801208434758"
          aria-labelledby="Yumeko Shikiya (志喜屋 夢子, Shikiya Yumeko)"
          className="rounded-md aspect-[10/4] md:aspect-[10/3] lg:aspect-[10/2] w-screen object-cover bg-muted"
          height={576}
          src={"/assets/default-banner.JPG"}
          width={1024}
        />
      )}

      <div className="w-full flex flex-row flex-nowrap items-center justify-start gap-x-2">
        {profileData.avatar_file_path ? (
          <Image
            alt={profileData.user_name}
            className="rounded-full w-[30%] h-[30%] max-w-[200px] max-h-[200px] object-cover aspect-square bg-muted"
            height={300}
            src={avatarUrl ? avatarUrl : ""}
            width={300}
          />
        ) : (
          <Image
            alt={profileData.user_name}
            aria-labelledby="Chinatsu Kano (鹿野 千夏 Kano Chinatsu)"
            className="rounded-full w-[30%] h-[30%] max-w-[200px] max-h-[200px] object-cover aspect-square bg-muted"
            height={300}
            src={"/assets/default-profile.png"}
            width={300}
          />
        )}

        <p className={title({ size: "sm", fullWidth: true })}>
          {profileData.user_name}
        </p>
      </div>
    </div>
  );
}
