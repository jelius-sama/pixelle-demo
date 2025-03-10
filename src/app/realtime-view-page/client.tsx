'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/server/supabase/client';

export default function ClientUpdates({ initialData }: { initialData: any[]; }) {
    const [data, setData] = useState(initialData);
    const supabase = createBrowserClient();

    useEffect(() => {
        const channel = supabase
            .channel('realtime_test')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'realtime_test' },
                payload => {
                    console.log("Real-time update received: ", payload);

                    // Fetch the latest data when a change occurs
                    supabase
                        .from('realtime_test')
                        .select('*')
                        .order('id', { ascending: true })
                        .then(({ data, error }) => {
                            if (error) {
                                console.error("Error fetching updated data: ", error);
                                return;
                            }
                            setData(data || []);
                        });
                }
            )
            .subscribe();

        // Cleanup on component unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}