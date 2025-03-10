import { createServerClient } from "@/server/supabase/server";
import { fetchArtistUserName } from "@/server/database/fetchUserMetadata";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const supabase = createServerClient();
        const body = await req.json();

        // Extract browse parameters
        const browse = body?.browse || {};
        const tags = browse.tags || null;
        const genre = browse.genre || null;

        // Ensure only one filter is used
        if (tags && genre) {
            return NextResponse.json({ error: "Only one filter (tags or genre) is allowed at a time." }, { status: 400 });
        }

        // Extract pagination details
        const page = Math.max(1, body?.pagination?.page ?? 1); // Ensure page is at least 1
        const limit = body?.pagination?.limit ?? 10;
        const offset = (page - 1) * limit;

        // Build the base query
        let query = supabase.from("artworks").select("*", { count: "exact" });

        // Handle filtering
        if (tags && tags.length > 0) {
            // Use multiple individual queries and combine the results
            const matchingArtworks = [];
            const seenIds = new Set();

            // Process each tag separately to get around the case sensitivity issue
            for (const tag of tags) {
                // For each tag, fetch artworks that contain this tag
                const { data: tagMatches } = await supabase
                    .from("artworks")
                    .select("*")
                    .filter('tags', 'cs', `{${tag}}`);

                // Add non-duplicate results to our matching set
                if (tagMatches) {
                    for (const artwork of tagMatches) {
                        if (!seenIds.has(artwork.id)) {
                            matchingArtworks.push(artwork);
                            seenIds.add(artwork.id);
                        }
                    }
                }
            }

            // If we have results, just return these directly with pagination
            if (matchingArtworks.length > 0) {
                // Sort by created_at descending
                matchingArtworks.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );

                // Apply pagination
                const startIndex = offset;
                const endIndex = Math.min(offset + limit, matchingArtworks.length);
                const paginatedResults = matchingArtworks.slice(startIndex, endIndex);

                // Fetch artist usernames
                const artworks = await Promise.all(
                    paginatedResults.map(async (artwork) => ({
                        ...artwork,
                        artist_user_name: await fetchArtistUserName(artwork.artist_uid),
                    }))
                );

                return NextResponse.json({
                    data: artworks,
                    pagination: {
                        page,
                        limit,
                        total: matchingArtworks.length,
                        totalPages: Math.ceil(matchingArtworks.length / limit),
                    },
                });
            } else {
                // No matches found
                return NextResponse.json({
                    data: [],
                    pagination: {
                        page,
                        limit,
                        total: 0,
                        totalPages: 0,
                    },
                });
            }
        } else if (genre) {
            query = query.in("artwork_type", genre);
        }

        // Apply sorting and pagination if we didn't return early
        query = query.order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;
        if (error) {
            console.error("Database query error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Fetch artist usernames and attach to results
        const artworks = await Promise.all(
            (data || []).map(async (artwork) => ({
                ...artwork,
                artist_user_name: await fetchArtistUserName(artwork.artist_uid),
            }))
        );

        return NextResponse.json({
            data: artworks,
            pagination: {
                page,
                limit,
                total: count ?? 0, // Total number of records
                totalPages: count ? Math.ceil(count / limit) : 1,
            },
        });
    } catch (err) {
        console.error("Request handling error:", err);
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}

