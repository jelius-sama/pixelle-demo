import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MarginedContent from '@/components/ui/margined-content';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: '404 - Page Not Found!'
};

export default function NotFound() {
    return (
        <MarginedContent className='flex items-center justify-center'>
            <Card className='w-full max-w-xl'>
                <CardHeader>
                    <CardTitle className='text-destructive'>404 - Page Not Found!</CardTitle>
                </CardHeader>

                <CardContent>
                    <CardDescription className='flex flex-col text-base'>
                        <span>The page you are looking for is not found on the server.</span>
                        <span>Check your URL and try again later!</span>
                    </CardDescription>
                </CardContent>

                <CardFooter className='justify-end'>
                    <Button asChild variant={'secondary'}>
                        <Link href={'/'}>
                            Return home
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </MarginedContent>
    );
}
