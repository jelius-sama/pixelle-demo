import { createServerClient } from "@/server/supabase/server";
import { ServerRuntime } from "next";
import { NextRequest, NextResponse } from "next/server";

interface ToggleRequest {
    listId: string;
    artworkId: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<{
    error: {
        code: string,
        message: string,
        details: unknown,
    } | null;
    success: boolean;
    message: string | null;
    action: string | null;
}>> {
    const supabase = createServerClient();

    try {
        const body: ToggleRequest = await request.json();
        const { listId, artworkId } = body;

        if (!listId || !artworkId) {
            return NextResponse.json(
                {
                    error: {
                        code: 'OPERATION_FAILED',
                        message: 'Missing required fields!',
                        details: 'Invalid request!'
                    },
                    success: false,
                    message: null,
                    action: null
                },
                { status: 400 }
            );
        }

        const { data: existingItem, error: checkError } = await supabase
            .from('list_items')
            .select('id')
            .eq('list_id', listId)
            .eq('artwork_id', artworkId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existingItem) {
            const { error: deleteError } = await supabase
                .from('list_items')
                .delete()
                .eq('list_id', listId)
                .eq('artwork_id', artworkId);

            if (deleteError) throw deleteError;

            return NextResponse.json({
                success: true,
                message: 'Item removed from list',
                action: 'removed',
                error: null
            });
        }

        const { error: insertError } = await supabase
            .from('list_items')
            .insert({
                list_id: listId,
                artwork_id: artworkId,
            });

        if (insertError) throw insertError;

        return NextResponse.json({
            success: true,
            message: 'Item added to list',
            action: 'added',
            error: null
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to modify list item',
                action: null,
                error: {
                    code: 'OPERATION_FAILED',
                    message: 'Failed to toggle list item',
                    details: error
                }
            },
            { status: 500 }
        );
    }
}
