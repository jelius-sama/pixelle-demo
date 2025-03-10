import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from '@/components/layout/image';
import { subtitle } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { UUID } from '@/server/database/schema';
import { ListMetadata } from '@/server/database/fetchList';
import MoreOptionsButton from '@/components/layout/more-options';

export default function ListCard({ list, userId }: { list: ListMetadata; userId: UUID | null; }) {

    return (
        <Card className='relative w-full max-w-[200px]'>
            <Link href={`/list/${list.listId}`} className='group'>
                <CardContent className='p-0'>
                    <Image
                        sourceOnError="default"
                        src={list.listThumb}
                        height={200}
                        width={200}
                        alt='test'
                        containerClassName='rounded-t-lg'
                        className='w-full h-full max-w-[200px] max-h-[200px] rounded-t-lg aspect-square object-cover'
                    />
                </CardContent>
            </Link>

            <CardFooter className='flex flex-row items-center justify-center p-2 relative'>
                <Link href={`/art/${list.listId}`} className='flex flex-1 w-full'>
                    <p className={subtitle({ className: 'my-0 truncate text-base lg:text-base block w-full md:w-full max-w-[calc((200px_-_40px)_-_(8px_*_2))]' })}>{list.listTitle}</p>
                </Link>

                <span className='w-fit flex items-center justify-center'>
                    <MoreOptionsButton
                        className='rounded-full size-8 [&_svg]:size-4'
                        artworkId={null}
                        userId={userId}
                        options={{
                            like: undefined,
                            saveToList: undefined,
                            deleteList: list.listId === "dislikes" || list.listId === "likes" ? undefined : { listId: list.listId },
                        }}
                    />
                </span>
            </CardFooter>

            <React.Fragment>
                <span className='absolute top-1 right-0 w-[58px] flex items-center justify-center'>
                    <Button asChild variant={'secondary'} size={'icon'} className='rounded-xl  w-fit px-2 h-6 flex items-center [&_svg]:size-3 [&_p]:text-xs'>
                        <Link href={`/list/${list.listId}`}>
                            <CopyIcon /><p>{list.totalItems}</p>
                        </Link>
                    </Button>
                </span>


            </React.Fragment>
        </Card>
    );
}

export function ListCardSkeleton() {
    return (
        <Card className='w-full max-w-[200px]'>
            <CardContent className='p-0 relative overflow-hidden'>
                <Skeleton className='overflow-hidden rounded-none rounded-t-lg w-full h-full max-h-[200px] max-w-[200px] aspect-square object-cover' />
                <div className='absolute top-1 bottom-1 right-0 w-[58px] flex flex-col justify-between items-center'>
                    <span>
                        <Button variant={'secondary'} size={'icon'} className='pointer-events-none rounded-xl overflow-hidden w-12 h-6 flex items-center [&_svg]:size-3 [&_p]:text-xs'>
                            <Skeleton className='w-full h-full rounded-none' />
                        </Button>
                    </span>
                </div>
            </CardContent>
            <CardFooter className='flex flex-row items-center justify-center p-2 gap-x-1'>
                <span className={subtitle({ className: 'my-0 truncate md:w-full' })}>
                    <Skeleton className='w-full h-[calc(28px-8px)]' />
                </span>
                <span>
                    <Button variant={'secondary'} size={'icon'} className='pointer-events-none overflow-hidden rounded-full size-10 [&_svg]:size-4'>
                        <Skeleton className='w-full h-full rounded-none' />
                    </Button>
                </span>
            </CardFooter>
        </Card>
    );
}