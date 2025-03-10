"use client";

import React from 'react';
import Image from '@/components/layout/image';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { subtitle } from '@/components/primitives';
import { useAtomValue } from 'jotai';
import { mobileAtom, userAtom } from '@/components/atoms';
import clsx from 'clsx';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cssVars } from '@/app.config';
import InputX from '@/components/layout/input-x';
import { ScrollArea } from '@/components/ui/scroll-area';
import CustomImage from '@/components/layout/image';
import ArtCard from '@/components/layout/art-card';
import Link from 'next/link';
import { ArtViewProps } from '@/components/layout/art-view/index';
import { ArtworkWithUserName } from '@/server/database/fetchUserMetadata';
import { User } from '@/types';
import { DislikeArtButton, LikeArtButton } from '@/components/layout/like-art';


const ArtCarouselSection = ({ artwork }: { artwork: ArtworkWithUserName; }) => {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const isMobile = useAtomValue(mobileAtom);

    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div className={clsx('h-fit border rounded-lg', !isMobile ? 'ml-0 md:ml-12 mr-0 md:mr-12' : 0)}>
            <Carousel setApi={setApi} className='select-none'>
                <CarouselContent className='w-full'>
                    {artwork.images.map((art, index) => (
                        <CarouselItem key={index}>
                            <div className="p-4 flex w-full h-full items-center justify-center">
                                <Image
                                    disableAnimation={true}
                                    className='w-full h-auto max-h-[40vh] md:max-h-[50vh] lg:max-h-[60vh] 2xl:max-h-[70vh] object-contain pointer-fine:cursor-zoom-in'
                                    containerClassName='!flex h-full w-full items-center justify-center'
                                    width={500}
                                    height={500}
                                    sourceOnError={'default'}
                                    src={art}
                                    alt={artwork.title}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className='hidden md:inline-flex' />
                <CarouselNext className='hidden md:inline-flex' />
            </Carousel>

            <div className="py-2 text-center text-sm text-muted-foreground">
                イラスト {current} of {artwork.images.length}
            </div>
        </div>
    );
};


const CommentsSection = () => {
    return (
        <React.Fragment>
            <p className={subtitle({ fullWidth: true, className: 'text-foreground' })}>Comments.</p>

            <div className='pb-20'>
                {Array.from({ length: 50 }).map((_, index) => (
                    <div key={index}>{index}</div>
                ))}
            </div>

            <form className='absolute w-[calc(100%_-_8px_*_2)] bottom-0 left-0 m-2 mx-0'>
                <InputX pending={'useFormStatus'} isRequired={true} inputType={'text'} identifier={'comment'} placeholder='Enter your comment...' />
            </form>
        </React.Fragment>
    );
};


const ArtMetadataSection = ({ artwork, user }: { artwork: ArtworkWithUserName; user: User | null | undefined }) => {
    return (
        <React.Fragment>
            <p className={subtitle({ fullWidth: true, className: "truncate block w-full text-foreground" })}>{artwork.title}</p>

            {user && (
                <div className='flex flex-nowrap flex-row items-center w-full gap-x-2 gap-y-2 mb-4'>
                    <span className='flex flex-nowrap flex-col items-center justify-center'>
                        <LikeArtButton
                            className="rounded-full size-10 [&_svg]:size-6"
                            artworkId={artwork.id}
                            userId={user.id}
                            likes={artwork.likes || []}
                        />
                        <p>{artwork.likes?.length ?? 0}</p>
                    </span>

                    <span className='flex flex-nowrap flex-col items-center justify-center'>
                        <DislikeArtButton
                            className="rounded-full size-10 [&_svg]:size-6"
                            artworkId={artwork.id}
                            userId={user.id}
                            dislikes={artwork.dislikes || []}
                        />
                        <p>{artwork.dislikes?.length ?? 0}</p>
                    </span>
                </div>
            )}

            <Link href={`/artist/${artwork.artist_uid}`} className='flex flex-row flex-nowrap items-center gap-x-2'>
                <span className='w-12 h-12'>
                    <CustomImage
                        sourceOnError={'default'}
                        disableAnimation={true}
                        containerClassName='pointer-coarse:group-active:opacity-100 pointer-fine:group-hover:opacity-100'
                        className='object-cover rounded-full w-12 h-12'
                        width={50}
                        height={50}
                        src={'/assets/default-banner.JPG'}
                        alt={'artist'}
                    />
                </span>
                <span className='flex flex-col items-center'>
                    <p className={subtitle({ fullWidth: true, className: 'my-0 truncate block text-base lg:text-base w-full md:w-full text-foreground' })}>{artwork.artist_user_name}</p>
                </span>
            </Link>
        </React.Fragment>
    );
};

const OtherWorkSection = ({ otherWorks, user }: { otherWorks: ArtworkWithUserName[] | null; user: User | null | undefined; }) => {

    return otherWorks && (
        <span className='flex items-center justify-center'>
            <Carousel opts={{ align: "start" }} className='w-[calc(100%_-_(24px_+_8px_+_(32px_*_2)))]'>
                <CarouselContent>
                    {otherWorks.map((artwork, index) => (
                        <CarouselItem key={index} className='basis-[150px] md:basis-[200px]'>
                            <ArtCard artwork={artwork} userId={user ? user.id : null} />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious icon='chevron' />
                <CarouselNext icon='chevron' />
            </Carousel>
        </span>
    );
};


const SuggestionSection = ({ suggestions, user }: { suggestions: ArtworkWithUserName[]; user: User | null | undefined; }) => {

    return (
        <ScrollArea style={{ height: `calc((100vh - 45vh) - ${(cssVars.headerPx + (cssVars.marginPx * 2) + cssVars.marginPx)}px)` }} className="w-full">
            <div>
                <p className={subtitle({ fullWidth: true, className: 'text-foreground' })}>For you.</p>
                {suggestions && (
                    <section className="w-full h-full grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] place-items-center gap-2">
                        {suggestions.map((suggestion, index) => <ArtCard artwork={suggestion} key={index} userId={user ? user.id : null} />)}
                    </section>
                )}
            </div>
        </ScrollArea>
    );
};


export const DesktopView = ({ artwork, otherWorks, suggestions }: ArtViewProps) => {
    const user = useAtomValue(userAtom);

    return (
        <ResizablePanelGroup direction="horizontal" style={{ minHeight: `calc(100vh - ${(cssVars.headerPx + (cssVars.marginPx * 2) + cssVars.marginPx)}px)`, maxWidth: `calc(100vw - ${cssVars.marginPx * 2}px)` }}>
            <ResizablePanel defaultSize={65} className='relative'>
                <ScrollArea style={{ height: `calc(100vh - ${(cssVars.headerPx + (cssVars.marginPx * 2) + cssVars.marginPx)}px)` }} className="w-full">
                    <ArtCarouselSection artwork={artwork} />
                    <CommentsSection />
                </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle className='mx-6' />

            <ResizablePanel defaultSize={35}>
                <div className='flex flex-col gap-y-1 h-[45vh]'>
                    <ArtMetadataSection artwork={artwork} user={user} />
                    <OtherWorkSection otherWorks={otherWorks} user={user} />
                </div>

                <SuggestionSection suggestions={suggestions} user={user} />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};