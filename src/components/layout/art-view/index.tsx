import React from 'react';
import { ArtworkWithUserName } from '@/server/database/fetchUserMetadata';
import NonReadingMode from '@/components/layout/art-view/non-reading-mode';
import ReadingMode from '@/components/layout/art-view/reading-mode';

export interface ArtViewProps {
    artwork: ArtworkWithUserName;
    otherWorks: ArtworkWithUserName[] | null;
    suggestions: ArtworkWithUserName[];
    style?: {
        artFocus?: {
            flexBasis?: string;
        };
        suggestionFocus?: {
            flexBasis?: string;
        };
    };
}

export default function ArtView({ artwork, style, otherWorks, suggestions }: ArtViewProps) {
    const shouldRenderFromReadingMode = artwork.artwork_type === "light_novel" || artwork.artwork_type === "manga";

    return (
        <React.Fragment>
            {shouldRenderFromReadingMode ? (
                <ReadingMode suggestions={suggestions} otherWorks={otherWorks} artwork={artwork} style={style} />
            ) : (
                <NonReadingMode suggestions={suggestions} otherWorks={otherWorks} artwork={artwork} style={style} />
            )}
        </React.Fragment>
    );
}