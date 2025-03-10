import { createServerClient } from "@/server/supabase/server";
import { isString } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * There is currently an error in production
 * where the server is unable to parse the json
 * in the request body. Note that this only 
 * happens in production and not in dev mode.
 */
export async function DELETE(req: NextRequest) {
    function invalidReq() {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    try {
        const supabase = createServerClient();

        let artId: string | null = null;

        try {
            if (req.body) {
                const body = await req.json();
                artId = body?.artId;
            } else {
                // Try to get from URL if body is empty
                const url = new URL(req.url);
                const encodedArtId = url.searchParams.get('artId');
                artId = encodedArtId ? decodeURIComponent(encodedArtId) : null;
            }
        } catch (jsonError) {
            console.error("JSON parsing error (trying to get the ID from search params):", jsonError);

            // Try to get from URL as fallback
            const url = new URL(req.url);
            const encodedArtId = url.searchParams.get('artId');
            artId = encodedArtId ? decodeURIComponent(encodedArtId) : null;
        }

        // Validate input
        if (!artId || !isString(artId)) {
            return invalidReq();
        }

        // Delete the artwork
        const { error } = await supabase.from("artworks").delete().eq("id", artId);

        if (error) {
            console.error("Database deletion error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Artwork deleted successfully." }, { status: 200 });
    } catch (err) {
        console.error("Request handling error:", err);
        return invalidReq();
    }
}
