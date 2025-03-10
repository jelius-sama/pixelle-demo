"use client";

import { MobileView } from "@/components/layout/art-view/reading-mode/mobile";
import { DesktopView } from "@/components/layout/art-view/reading-mode/desktop";
import React from "react";
import { mobileAtom } from "@/components/atoms";
import { useAtomValue } from "jotai";
import { ArtViewProps } from '@/components/layout/art-view/index';

export default function ReadingMode({ artwork, otherWorks, suggestions, style }: ArtViewProps) {
    const isMobile = useAtomValue(mobileAtom);

    return (
        <React.Fragment>
            {isMobile ? <MobileView suggestions={suggestions} otherWorks={otherWorks} artwork={artwork} style={style} /> : <DesktopView suggestions={suggestions} otherWorks={otherWorks} artwork={artwork} style={style} />}
        </React.Fragment>
    );
}