import { subtitle, title } from '@/components/primitives';
import MarginedContent from '@/components/ui/margined-content';
import getUserOrRedirect from '@/utils/get-user';
import { Metadata, ServerRuntime } from 'next';
import React from 'react';
import PageTitle from '@/components/layout/page-title';
import ListCard from '@/components/layout/list-card';
import { fetchListsMetadata } from '@/server/database/fetchList';

export const metadata: Metadata = {
    title: "Library"
};

export default async function LibraryPage() {
    const { user } = await getUserOrRedirect({ redirectTo: "sign-in" });
    const { predefined, userDefined } = await fetchListsMetadata(user.id);

    return (
        <MarginedContent>
            <PageTitle className={title({ color: 'foreground' })}>Library</PageTitle>

            <div className='flex flex-col'>
                <section className="mb-2 w-full h-full grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] place-items-center gap-2">
                    {predefined.map((list, index) => (
                        <ListCard list={list} key={index} userId={user.id} />
                    ))}
                </section>

                <p className={subtitle()}>Your Lists</p>
                <section className="w-full h-full grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] place-items-center gap-2">
                    {userDefined.map((list, index) => (
                        <ListCard list={list} key={index} userId={user.id} />
                    ))}
                </section>
            </div>
        </MarginedContent>
    );
}
