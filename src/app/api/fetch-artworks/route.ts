import { createServerClient } from "@/server/supabase/server";
import { ArtWork } from "@/server/database/schema";
import { fetchArtistUserName } from "@/server/database/fetchUserMetadata";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createServerClient();

    // Fetch all artworks
    const { data, error } = await supabase
        .from('artworks')
        .select('*');

    if (error) {
        console.error("Error fetching initial data: ", error);
        return NextResponse.json({ data: null, error: error });
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

    return NextResponse.json({ data: ArtworkWithUserNames, error: null });
}
