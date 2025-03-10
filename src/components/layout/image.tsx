"use client";

import React, { useState } from "react";
import NextJsImage, { ImageProps as NextJsImageProps } from "next/image";
import { cn } from "@/utils";

interface ImageProps extends Omit<Omit<Omit<Omit<Omit<Omit<NextJsImageProps, "style">, "className">, "onError">, "onLoadingComplete">, "width">, "height"> {
    sourceOnError: "default" | (string & {});
    className?: string;
    containerClassName?: string;
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    width: number;
    height: number;
    disableAnimation?: boolean;
}


const normalizeSrc = (src: string) => {
    return src.startsWith('/') ? src.slice(1) : src;
};


export default function Image({ disableAnimation = false, sourceOnError, containerClassName, className, style, containerStyle, src, width, height, ...rest }: ImageProps) {
    const [source, setSource] = useState(src);

    return (
        <span className={cn("overflow-hidden transition-all duration-300 pointer-coarse:group-active:opacity-75 pointer-fine:group-hover:opacity-75", containerClassName)} style={{ position: "relative", contain: "layout paint style", display: "block", ...containerStyle }}>
            <NextJsImage
                className={cn("w-full h-full ease-in-out duration-700", className)}
                src={source}
                onError={() => setSource(sourceOnError === "default" ? "/assets/logo.jpg" : sourceOnError)}
                style={!disableAnimation ? {
                    filter: "grayscale(100%) blur(40px)",
                    transform: "scaleX(1.1) scaleY(1.1)",
                    ...style
                } : {}}
                width={width}
                height={height}
                onLoadingComplete={(e) => {
                    if (disableAnimation) return;
                    e.style.filter = "grayscale(0%) blur(0px)";
                    e.style.transform = "scaleX(1) scaleY(1)";
                }}
                {...rest}
            />
        </span>
    );
}
