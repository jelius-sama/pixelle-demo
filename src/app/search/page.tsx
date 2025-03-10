import InputX from '@/components/layout/input-x';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MarginedContent from '@/components/ui/margined-content';
import { SubmitButton } from '@/components/ui/submit-button';
import { encodedRedirect, isString } from '@/utils';
import { AlertCircle, SearchIcon } from 'lucide-react';
import { Metadata, ServerRuntime } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
    title: "Search"
};

export default async function SearchPage({ searchParams }: { searchParams: { error: string | null; }; }) {
    const origin = headers().get("x-origin");
    const placeholder: { tip: string; error: string | null; } = {
        tip: '',
        error: null
    };

    if (!origin) {
        placeholder.error = 'Failed to fetch search tip!';
    } else {
        const res = await fetch(`${origin}/api/search/placeholder-tip`, { method: "GET" });

        if (!res.ok) {
            placeholder.error = 'Failed to fetch search tip!';
        }

        const { tip } = await res.json() as { tip: string; };

        // Validate the structure of the response
        if (!tip) {
            placeholder.error = 'Failed to fetch search tip!';
        } else {
            placeholder.tip = tip;
        }
    }

    const performSearch = async (formData: FormData) => {
        "use server";

        const query = formData.get('search-query');
        const sanitizedQuery = isString(query) && String(query);

        if (!sanitizedQuery) {
            encodedRedirect({ type: 'error', path: "/search", params: { error: "Search input should be a string!" } });
        }

        redirect(`/search/${encodeURIComponent(sanitizedQuery)}`);
    };

    return (
        <MarginedContent className={`flex flex-col items-center justify-center`}>
            <form action={performSearch}
                className="flex flex-col w-full max-w-lg gap-y-1.5 items-start p-5 border rounded-md">
                <p className="font-bold text-lg">Search</p>

                {searchParams.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {searchParams.error}
                        </AlertDescription>
                    </Alert>
                )}

                <span className='flex w-full h-full gap-x-2'>
                    <InputX
                        autoFocus={true}
                        containerClassName='flex-1'
                        pending={'useFormStatus'}
                        isRequired={true}
                        inputType={'text'}
                        identifier={'search-query'}
                        placeholder={placeholder.tip.length >= 1 ? `eg.: ${placeholder.tip}` : placeholder.tip}
                    />
                    <SubmitButton><SearchIcon /></SubmitButton>
                </span>
            </form>
        </MarginedContent>
    );
}