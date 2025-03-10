import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MenuIcon, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { title } from "@/components/primitives";
import { User } from "@/types";
import React, { Suspense } from 'react';
import appConfig, { cssVars, getNavItems } from '@/app.config';
import Header from "@/components/layout/header";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvatarUrl } from "@/server/function/createSignedUrl";

export default function Sidenav({ user, }: { user: User | null; }) {
    const avatarURL = getAvatarUrl();
    const navItems = getNavItems(user, avatarURL);

    return (
        <Sheet>
            <Header
                user={user}
                sideBarMenuTrigger={
                    <SheetTrigger asChild>
                        <Button size={'icon'} variant={"outline"} className="rounded-full [&_svg]:size-auto">
                            <MenuIcon strokeWidth={2} />
                        </Button>
                    </SheetTrigger>
                }
            />

            <SheetContent className={`w-[65%] sm:w-[50%] md:w-[300px] p-0`} side={"left"}>
                <SheetHeader className="flex flex-row w-full items-center space-y-0" style={{ padding: `${cssVars.marginPx}px`, paddingBottom: 0, height: `${cssVars.navHeaderPx}px` }} >
                    <span className="flex flex-1 flex-row items-center gap-x-2 select-none">
                        <Image src={appConfig.icons.icon} alt={appConfig.title.default} height={cssVars.headerPx} width={cssVars.headerPx} className="w-7 h-7 aspect-square rounded-md" />
                        <SheetTitle className={title({ className: "text-xl lg:text-2xl" })}>{appConfig.title.default}</SheetTitle>
                    </span>
                    <SheetClose asChild>
                        <Button variant={'secondary'} size={'icon'} className={'w-7 h-7 rounded-full'}><X /></Button>
                    </SheetClose>
                </SheetHeader>

                <ScrollArea className="w-full" style={{ padding: `${cssVars.marginPx}px`, paddingTop: `${cssVars.navItemsMarginPx}px`, height: `calc(100% - ${cssVars.navHeaderPx + cssVars.navItemsMarginPx}px)` }}>
                    <div className='flex flex-col gap-y-2'>
                        {Object.values(navItems).map((item, index) =>
                            item ? <React.Fragment key={index}>{item}</React.Fragment> : null
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
