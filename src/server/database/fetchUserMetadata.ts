"use server";

import { createAdminClient } from "@/server/supabase/server";
import { UserMetadata } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";
import { ArtWork, UUID } from "@/server/database/schema";

export interface ArtworkWithUserName extends ArtWork {
    artist_user_name: string;
}

export default async function fetchRawUserMetaData(artistUid: UUID): Promise<{ data: UserMetadata | null, error: PostgrestError | null, }> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .rpc('fetch_raw_user_meta_data', { user_id: artistUid }) as {
            data: { raw_user_meta_data: UserMetadata; }[] | null,
            error: PostgrestError | null,
        };

    if (!data || error || data.length === 0) {
        return { data: null, error: error };
    }

    return { data: data[0].raw_user_meta_data, error: error };
}

export async function fetchArtistUserName(artistUid: UUID): Promise<string> {
    const { data, error } = await fetchRawUserMetaData(artistUid);

    if (error || !data) {
        console.error("Error fetching artist data: ", error);
        return '---';
    }

    return data.user_name;
}
