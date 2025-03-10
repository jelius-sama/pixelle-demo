"use client";

import { useThemeColor } from '@/hooks/useThemeColor';
import { useAtomValue } from 'jotai';
import React from 'react';
import { mobileAtom } from '@/components/atoms';
import { isNumber } from '@/utils';

interface PlatformIndependentSize {
    mobile?: number,
    desktop?: number,
}

export default function ActivityIndicator({
    size = 54,
    strokeWidth = '6%',
    strokeHeight = '16%',
    color
}: {
    size?: number | PlatformIndependentSize;
    strokeWidth?: string;
    strokeHeight?: string;
    color?: string;
}) {
    const foregroundColor = useThemeColor("foreground");
    const isMobile = useAtomValue(mobileAtom);
    const s = isNumber(size) ? size : isMobile ? size.mobile || 54 : size.desktop || 54;
    const width = `${s}px`;
    const height = `${s}px`;

    return (
        <div
            className="relative flex justify-center items-center"
            style={{ width, height }}
            aria-label='loading'
        >
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={i}
                    className={`absolute opacity-0 rounded-[50px] animate-activity-indicator`}
                    style={{
                        boxShadow: '0 0 3px rgba(0, 0, 0, 0.2)',
                        width: strokeWidth,
                        height: strokeHeight,
                        backgroundColor: color || foregroundColor,
                        transform: `rotate(${i * 30}deg) translate(0, -130%)`,
                        animationDelay: `${-((11 - i) * 0.0833).toFixed(4)}s`,
                    }}
                ></div>
            ))}
        </div>
    );
}