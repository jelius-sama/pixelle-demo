"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cssVars } from '@/app.config';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { mobileAtom } from '@/components/atoms';

export default function TagsCarousel() {
    const isMobile = useAtomValue(mobileAtom);

    return (
        <div className="w-full flex flex-row justify-center">
            <Carousel
                opts={{
                    align: "start",
                }}
                style={{
                    width: `calc(100% - ${!isMobile ? (cssVars.marginPx * 2) : 0}px - ${!isMobile ? 32 * 2 : 0}px)`
                }}
            >
                <CarouselContent>
                    {Array.from({ length: 24 }).map((_, index) => (
                        <CarouselItem key={index} className="flex flex-row gap-2 items-center justify-center my-4 basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/12">
                            <Button size={'chip'} variant={'colorful'} color={clsx(
                                (() => {
                                    const randomValue = Math.floor(Math.random() * 4);
                                    return randomValue === 0
                                        ? "text-red-600 bg-red-100 hover:bg-red-200"
                                        : randomValue === 1
                                            ? "text-blue-600 bg-blue-100 hover:bg-blue-200"
                                            : randomValue === 2
                                                ? "text-green-600 bg-green-100 hover:bg-green-200"
                                                : "text-yellow-600 bg-yellow-100 hover:bg-yellow-200";
                                })()
                            )}
                            >
                                <span className="w-fit max-w-[96px] sm:max-w-[90px] md:max-w-[96px] lg:max-w-[80px] xl:max-w-[76px] truncate">#anime_girl#anime_girl</span>
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {!isMobile && (
                    <React.Fragment>
                        <CarouselPrevious variant={'ghost'} icon="chevron" className='hidden md:inline-flex' />
                        <CarouselNext variant={'ghost'} icon="chevron" className='hidden md:inline-flex' />
                    </React.Fragment>
                )}
            </Carousel>
        </div>
    );
}
