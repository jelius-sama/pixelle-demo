"use server";

import { createServerClient } from "@/server/supabase/server";
import { ArtWork, UUID } from "@/server/database/schema";
import { ArtworkWithUserName, fetchArtistUserName } from "@/server/database/fetchUserMetadata";

export default async function fetchArtworks(): Promise<ArtworkWithUserName[]> {
    const supabase = createServerClient();

    // Fetch all artworks
    const { data, error } = await supabase
        .from('artworks')
        .select('*');

    if (error) {
        console.error("Error fetching initial data: ", error);
        return [];
    }

    const artworks = data as ArtWork[];

    // For each artwork, fetch the artist's user name and add it to the artwork data
    const ArtworkWithUserNames = await Promise.all(
        artworks.map(async (artwork) => {
            const userName = await fetchArtistUserName(artwork.artist_uid);

            // Return the artwork data with the user name added
            return {
                ...artwork,
                artist_user_name: userName,
            };
        })
    );

    return ArtworkWithUserNames;
}


export async function fetchArtworkById(artId: UUID): Promise<ArtworkWithUserName | null> {
    const supabase = createServerClient();

    // Fetch the artwork with the specified artwork_id
    const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', artId)
        .single();

    if (error || !data) {
        console.error("Error fetching artwork data: ", error);
        return null; // Return null if the artwork doesn't exist or an error occurred
    }

    const artwork = data as ArtWork;

    // Fetch the artist's user name
    const artistUserName = await fetchArtistUserName(artwork.artist_uid);

    // Add the artist's username to the artwork data
    const artworkWithUserName: ArtworkWithUserName = {
        ...artwork,
        artist_user_name: artistUserName,
    };

    return artworkWithUserName;
}


export async function fetchArtworksByArtistId(artistId: string): Promise<ArtworkWithUserName[] | null> {
    const supabase = createServerClient();

    // Fetch the artworks with the specified artist_uid
    const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_uid', artistId);

    if (error || !data) {
        console.error("Error fetching artworks data: ", error);
        return null; // Return null if no artworks exist or an error occurred
    }

    const artworks = data as ArtWork[];

    // Fetch the artist's user name (assuming all artworks belong to the same artist)
    const artistUserName = await fetchArtistUserName(artistId);

    // Map over artworks and add the artist's username to each artwork
    const ArtworkWithUserName: ArtworkWithUserName[] = artworks.map(artwork => ({
        ...artwork,
        artist_user_name: artistUserName,
    }));

    return ArtworkWithUserName;
}


export async function fetchUserLikedArtworks(userId: string): Promise<ArtworkWithUserName[] | null> {
    const supabase = createServerClient();

    // Fetch the artworks liked by the user
    const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .filter('likes', 'cs', JSON.stringify([{ uid: userId }])); // Check if the userId is in the likes array

    if (error || !data) {
        console.error("Error fetching liked artworks data: ", error);
        return null; // Return null if no artworks exist or an error occurred
    }

    if (data.length <= 0) {
        return null;
    }

    const artworks = data as ArtWork[];

    // Fetch the usernames of the respective artists for the liked artworks
    const artworksWithUsernames: ArtworkWithUserName[] = await Promise.all(
        artworks.map(async (artwork) => {
            const artistUserName = await fetchArtistUserName(artwork.artist_uid);
            return {
                ...artwork,
                artist_user_name: artistUserName,
            };
        })
    );

    return artworksWithUsernames;
}

export async function fetchUserDislikedArtworks(userId: string): Promise<ArtworkWithUserName[] | null> {
    const supabase = createServerClient();

    // Fetch the artworks liked by the user
    const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .filter('dislikes', 'cs', JSON.stringify([{ uid: userId }])); // Check if the userId is in the likes array

    if (error || !data) {
        console.error("Error fetching liked artworks data: ", error);
        return null; // Return null if no artworks exist or an error occurred
    }

    if (data.length <= 0) {
        return null;
    }

    const artworks = data as ArtWork[];

    // Fetch the usernames of the respective artists for the liked artworks
    const artworksWithUsernames: ArtworkWithUserName[] = await Promise.all(
        artworks.map(async (artwork) => {
            const artistUserName = await fetchArtistUserName(artwork.artist_uid);
            return {
                ...artwork,
                artist_user_name: artistUserName,
            };
        })
    );

    return artworksWithUsernames;
}
