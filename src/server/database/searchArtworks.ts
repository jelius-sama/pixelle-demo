"use server";

import { createServerClient } from "@/server/supabase/server";
import { ArtWork } from "@/server/database/schema";
import { ArtworkWithUserName, fetchArtistUserName } from "@/server/database/fetchUserMetadata";

export default async function searchArtworks(query: string): Promise<ArtworkWithUserName[]> {
    const supabase = createServerClient();

    // Perform the search in the `artworks` table
    const { data: artworks, error } = await supabase
        .from("artworks")
        .select("*")
        .or(
            `title.ilike.%${query}%,tags.cs.{${query}}`
        ); // Search in title (case-insensitive) or tags (matches as an array element)

    if (error) {
        console.error("Error searching artworks:", error);
        return [];
    }

    const ArtworkWithUserNames = await Promise.all(
        (artworks as ArtWork[]).map(async (artwork) => {
            const artist_user_name = await fetchArtistUserName(artwork.artist_id);
            return {
                ...artwork,
                artist_user_name,
            };
        })
    );

    return ArtworkWithUserNames;
}
