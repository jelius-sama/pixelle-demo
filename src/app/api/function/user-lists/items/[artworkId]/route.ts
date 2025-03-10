import { createServerClient } from "@/server/supabase/server";
import { ServerRuntime } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { artworkId: string; }; }
) {
    const supabase = createServerClient();
    const artworkId = parseInt(params.artworkId);

    if (isNaN(artworkId)) {
        return NextResponse.json(
            { error: 'Invalid artwork ID' },
            { status: 400 }
        );
    }

    try {
        const { data, error } = await supabase
            .from('list_items')
            .select('list_id')
            .eq('artwork_id', artworkId);

        if (error) {
            return NextResponse.json(
                {
                    error: { name: 'Failed to fetch lists containing artwork', details: error },
                    data: null
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            data: data.map(item => item.list_id) as string[],
            error: null
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: { name: 'An unexpected error occurred', details: error },
                data: null
            },
            { status: 500 }
        );
    }
}