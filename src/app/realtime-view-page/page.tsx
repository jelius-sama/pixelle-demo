import MarginedContent from '@/components/ui/margined-content';
import { createServerClient } from '@/server/supabase/server';
import { Metadata, ServerRuntime } from 'next';
import ClientUpdates from './client';
import { cssVars } from '@/app.config';

export const metadata: Metadata = {
    title: "Supabase realtime test!"
};

async function fetchInitialData() {
    "use server";
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('realtime_test')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error fetching initial data: ", error);
        return [];
    }

    return data || [];
}

export default async function ViewPage() {
    const initialData = await fetchInitialData();

    return (
        <MarginedContent
            style={{ width: `calc(100% - ${cssVars.marginPx * 2})` }}
            className='h-full flex flex-col items-center justify-center'>
            <ClientUpdates initialData={initialData} />
        </MarginedContent>
    );
}
