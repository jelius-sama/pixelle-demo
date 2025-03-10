import StillInDevelopment from '@/components/in-dev';
import PageTitle from '@/components/layout/page-title';
import { title } from '@/components/primitives';
import MarginedContent from '@/components/ui/margined-content';
import { AdminUserMetadata } from '@/types';
import getUserOrRedirect from '@/utils/get-user';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
    title: "Admin Dashboard"
};

export default async function AdminDashboard({ searchParams }: { searchParams: { success?: string, error?: string; value?: string; }; }) {
    const { user } = await getUserOrRedirect({ redirectTo: 'sign-in' });
    const user_metadata = user.user_metadata as AdminUserMetadata;

    if (!user_metadata.is_admin === true) {
        notFound();
    }

    return (
        <MarginedContent>
            <PageTitle className={title({ color: "foreground" })}>
                Admin Panel
            </PageTitle>

            <StillInDevelopment />
        </MarginedContent>
    );
}
