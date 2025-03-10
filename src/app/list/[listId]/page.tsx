import { title } from '@/components/primitives';
import MarginedContent from '@/components/ui/margined-content';
import { fetchUserDislikedArtworks, fetchUserLikedArtworks } from '@/server/database/fetchArtwork';
import { fetchUserDefinedList, ListItemWithMetadata } from '@/server/database/fetchList';
import getUserOrRedirect from '@/utils/get-user';
import { Metadata, ServerRuntime } from 'next';
import React from 'react';
import DetailedArtCard, { DetailedArtCardSkeleton } from '@/components/layout/detailed-art-card';
import { ArtworkWithUserName } from '@/server/database/fetchUserMetadata';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import PageTitle from '@/components/layout/page-title';

export const generateMetadata = async ({ params }: { params: { listId: "likes" | "dislikes" | (bigint & {}); }; }): Promise<Metadata> => {
    let listTitle: string | undefined = undefined;

    switch (params.listId) {
        case 'likes':
            listTitle = "Your likes";
            break;

        case 'dislikes':
            listTitle = "Your Dislikes";
            break;

        default:
            const rawData = await fetchUserDefinedList(params.listId);
            listTitle = rawData ? rawData.title : "List not found";
            break;
    }

    return {
        title: listTitle
    };
};

export default async function ListPage({ params }: { params: { listId: "likes" | "dislikes" | (bigint & {}); }; }) {
    const { user } = await getUserOrRedirect({ redirectTo: "sign-in" });
    let artworksList: ArtworkWithUserName[] | null | { message: string; type: "Error" | "Message"; } = null;
    let rawData: ListItemWithMetadata | null = null;

    switch (params.listId) {
        case 'likes':
            artworksList = await fetchUserLikedArtworks(user.id);
            break;

        case 'dislikes':
            artworksList = await fetchUserDislikedArtworks(user.id);
            break;

        default:
            rawData = await fetchUserDefinedList(params.listId);
            if (rawData && rawData.items) {
                if (rawData.items.length <= 0) {
                    artworksList = { message: "No items in the list.", type: "Message" };
                    return;
                };
                artworksList = rawData.items.map(item => item.artwork);
            } else {
                artworksList = { message: "List does not exists.", type: "Error" };
            }
            break;
    }

    return (
        <MarginedContent>
            <PageTitle className={title({ color: 'foreground' })}>
                {params.listId === "likes" ? "Your likes" : params.listId === "dislikes" ? "Your dislikes" : rawData ? rawData.title : "List not found"}
            </PageTitle>

            {artworksList && artworksList instanceof Array && (
                <section className="w-full h-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] place-items-center gap-2">
                    {artworksList.map((artwork, index) => (
                        <DetailedArtCard artwork={artwork} key={index} />
                    ))}
                </section>
            )}


            {artworksList && !(artworksList instanceof Array) && (
                <section className='w-full flex items-center justify-center'>
                    <Alert variant="destructive" className='w-full max-w-lg'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{artworksList.type}</AlertTitle>
                        <AlertDescription className='flex flex-col flex-nowrap gap-y-1'>
                            {artworksList.message}
                        </AlertDescription>
                    </Alert>
                </section>
            )}

            {artworksList === null && (
                <section className='w-full flex items-center justify-center'>
                    <Alert variant="default" className='w-full max-w-lg'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Items</AlertTitle>
                        <AlertDescription className='flex flex-col flex-nowrap gap-y-1'>
                            <span>Add Items by browsing through artworks.</span>
                            <span>Click here to <Link href={'/browse'} className='pointer-fine:hover:underline text-blue-600'>browse</Link>.</span>
                        </AlertDescription>
                    </Alert>
                </section>
            )}
        </MarginedContent>
    );
}
