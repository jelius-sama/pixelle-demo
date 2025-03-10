import { createServerClient } from "@/server/supabase/server";
import { ServerRuntime } from "next";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export interface List {
    id: string;
    title: string;
    belongs_to: string;
    created_at: string;
    updated_at: string | null;
    custom_thumbnail: string | null;
}

export async function GET() {
    const supabase = createServerClient();

    try {
        const { data, error } = await supabase
            .from('lists')
            .select('*')
            .order('updated_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: { name: 'Failed to fetch lists', details: error }, data: null },
                { status: 500 }
            );
        }

        return NextResponse.json({ data: data, error: null });
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


export async function POST(req: NextRequest): Promise<NextResponse<{ error: string | null, success: boolean; }>> {
    const supabase = createServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || user === null) {
        return NextResponse.json({ error: userError ? userError.message : "You are not signed in!", success: false }, { status: 401 });
    }

    const body = await req.json() as { newListTitle: string | null; };
    const { newListTitle } = body;

    if (!newListTitle) {
        return NextResponse.json({ error: 'Title is required', success: false }, { status: 400 });
    }

    try {
        const { error: insertError } = await supabase.from('lists').insert({
            title: newListTitle,
            belongs_to: user.id
        });

        if (insertError) {
            throw new Error(insertError.message);
        }
    } catch (error) {
        console.error('Database insert error:', error);
        return NextResponse.json({ error: (error as Error).message, success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true, error: null });
}


export async function DELETE(req: NextRequest) {
    const supabase = createServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || user === null) {
        return NextResponse.json({ error: userError ? userError.message : "You are not signed in!", success: false }, { status: 401 });
    }

    const { listId, actionPerformedAt } = await req.json() as { listId: string | null; actionPerformedAt: string; };

    if (!listId) {
        return NextResponse.json({ error: 'List ID is required', success: false }, { status: 400 });
    }

    const { error: deleteError } = await supabase
        .from('lists')
        .delete()
        .match({ id: listId, belongs_to: user.id });

    if (deleteError) {
        return NextResponse.json({ error: deleteError.message, success: false }, { status: 500 });
    }

    revalidatePath(actionPerformedAt, "page");


    return NextResponse.json({ success: true, error: null });
}
