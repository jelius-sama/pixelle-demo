"use server";

import { createServerClient } from '@/server/supabase/server';
import { UserMetadata } from '@/types';

export default async function createSignedUrl(path?: string | null): Promise<{ url: string | null, error: string | null; } | null> {
    if (!path) return null;

    const supabase = createServerClient();
    const { data: UrlData, error: UrlError } = await supabase.storage
        .from('user-assets')
        .createSignedUrl(path, 43200);

    if (UrlError) {
        return { url: null, error: 'Failed to get signed URL.' };
    }

    return { url: UrlData.signedUrl, error: null };
}

export async function getFilePathForBannerOrProfile(file: "avatar" | "banner") {
    const supabase = createServerClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
        return null;
    }

    if (file === "avatar") {
        return (user.user_metadata as UserMetadata).avatar_file_path;
    } else {
        return (user.user_metadata as UserMetadata).banner_file_path;
    }
}

export async function getAvatarUrl(): Promise<string | null> {
    const supabase = createServerClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
        return null;
    }

    const data = await createSignedUrl((user.user_metadata as UserMetadata).avatar_file_path);

    if (!data) return null;

    if (data.error) {
        console.log("Error when fetching avatar url: ", data.error);
        return null;
    } else {
        return data.url;
    }
}

export async function getBannerUrl() {
    const supabase = createServerClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
        return null;
    }

    const data = await createSignedUrl((user.user_metadata as UserMetadata).banner_file_path);

    if (!data) return null;

    if (data.error) {
        console.log("Error when fetching banner url: ", data.error);
        return null;
    } else {
        return data.url;
    }
}