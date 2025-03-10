"use client";

import React from 'react';
import Image from '@/components/layout/image';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { subtitle } from '@/components/primitives';
import { useAtomValue } from 'jotai';
import { mobileAtom } from '@/components/atoms';
import clsx from 'clsx';
import { ArtViewProps } from '@/components/layout/art-view/index';

export const MobileView = ({ artwork, style }: ArtViewProps) => {
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
        <div className='flex flex-col md:flex-row md:gap-x-6 justify-center md:justify-start'>
            <div
                style={{
                    flexBasis: !isMobile ? style?.artFocus?.flexBasis : undefined,
                }}
                className={clsx('h-fit border rounded-lg', !isMobile ? 'ml-0 md:ml-12' : 0)}
            >
                <Carousel setApi={setApi} className='select-none'>
                    <CarouselContent className='w-full'>
                        {artwork.images.map((art, index) => (
                            <CarouselItem key={index}>
                                <div className="p-4 flex w-full h-full items-center justify-center">
                                    <Image
                                        disableAnimation={true}
                                        className='w-full h-auto max-h-[50vh] md:max-h-[60vh] lg:max-h-[70vh] 2xl:max-h-[80vh] object-contain pointer-fine:cursor-zoom-in'
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
                    {!isMobile && (
                        <React.Fragment>
                            <CarouselPrevious className='hidden md:inline-flex' />
                            <CarouselNext className='hidden md:inline-flex' />
                        </React.Fragment>
                    )}
                </Carousel>

                <div className="py-2 text-center text-sm text-muted-foreground">
                    イラスト {current} of {artwork.images.length}
                </div>
            </div>

            <div style={{ flexBasis: !isMobile ? style?.suggestionFocus?.flexBasis : undefined }} className='flex flex-col'>
                <p className={subtitle()}>
                    Art: {artwork.title}
                </p>
                <p className={subtitle()}>
                    Artist: {artwork.artist_user_name}
                </p>
            </div>
        </div>
    );
};
