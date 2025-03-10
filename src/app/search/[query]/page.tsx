import DetailedArtCard from '@/components/layout/detailed-art-card';
import PageTitle from '@/components/layout/page-title';
import { title } from '@/components/primitives';
import MarginedContent from '@/components/ui/margined-content';
import searchArtworks from '@/server/database/searchArtworks';
import { Metadata, ServerRuntime } from 'next';
import React from 'react';

const dataFetcher = async (q: string) => {
    return await searchArtworks(q);
};

export function generateMetadata({ params }: { params: { query: string; }; }): Metadata {
    return {
        title: params.query,
    };
};

export default async function SearchResults({ params }: { params: { query: string; }; }) {
    const data = await dataFetcher(params.query);

    return (
        <MarginedContent>
            <PageTitle className={title({ color: "foreground" })}>
                Search result for &quot;{decodeURIComponent(params.query)}&quot;
            </PageTitle>
            <section className="w-full h-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] place-items-center gap-2">
                {data.map((d, index) => (
                    <DetailedArtCard artwork={d} key={index} />
                ))}
            </section>
        </MarginedContent>
    );
}
