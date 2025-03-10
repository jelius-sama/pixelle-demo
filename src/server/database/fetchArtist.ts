"use server";

import { createServerClient } from "@/server/supabase/server";
import { UserMetadata } from "@/types";
import { ArtWork, UUID } from "@/server/database/schema";
import fetchRawUserMetaData from "@/server/database/fetchUserMetadata";

export interface Artist extends UserMetadata {
    artist_uid: UUID;
    artworks: Omit<ArtWork, "artist_uid">[];
}

export default async function fetchArtist(artistID: UUID): Promise<Artist | null> {
    const supabase = createServerClient();

    // Fetch the artist's metadata
    const { data: userMetaData, error: userError } = await fetchRawUserMetaData(artistID);

    if (userError || !userMetaData) {
        console.error("Error fetching artist metadata:", userError);
        return null; // Return null if metadata fetch fails
    }

    // Fetch all artworks by the artist
    const { data: artworks, error: artworksError } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_uid', artistID);

    if (artworksError) {
        console.error("Error fetching artworks:", artworksError);
        return null; // Return null if artwork fetch fails
    }

    if (!artworks || artworks.length === 0) {
        return null;
    }

    // Remove `artist_uid` from each artwork and include it at the top
    const formattedArtworks = artworks.map(({ artist_uid, ...rest }) => rest) as Omit<ArtWork, "artist_uid">[];

    // Combine metadata with artworks
    const artist: Artist = {
        ...userMetaData,
        artist_uid: artistID,
        artworks: formattedArtworks,
    };

    return artist;
}
