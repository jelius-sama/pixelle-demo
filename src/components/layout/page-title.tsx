"use client";

import { cssVars } from '@/app.config';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import React, { HTMLProps, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props extends HTMLProps<HTMLParagraphElement> {
    children: string | string[];
}

const titleAtom = atom<string | null>(null);

export default function PageTitle({ children, ...rest }: Props) {
    const titleRef = useRef<HTMLParagraphElement | null>(null);
    const setTitle = useSetAtom(titleAtom);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTitle(null);
                } else {
                    setTitle(children.toString());
                }
            },
            {
                root: null,
                threshold: 1,
            }
        );

        const targetElement = titleRef.current;

        if (targetElement) {
            observer.observe(targetElement);
        }

        return () => {
            if (targetElement) {
                observer.unobserve(targetElement);
            }
            setTitle(null);
        };
    }, []);

    return <div className='mb-2'><p ref={titleRef} {...rest}>{children}</p></div>;
}

export function HeaderTitle() {
    const title = useAtomValue(titleAtom);

    return (
        <AnimatePresence>
            {title && (
                <motion.span
                    initial={{ y: 50, opacity: 0 }} // Start from below
                    animate={{ y: 0, opacity: 1 }}  // Move to position
                    exit={{ y: 50, opacity: 0 }}   // Exit to below
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                    }}
                    className="absolute top-0 right-0 -z-50 transform flex items-center justify-center"
                    style={{
                        height: `${cssVars.headerPx + cssVars.marginPx * 2}px`,
                        width: `calc(100% - ${cssVars.marginPx * 2}px)`,
                        marginInline: `${cssVars.marginPx}px`,
                        paddingBlock: `${cssVars.marginPx}px`,
                    }}
                >
                    <p className="text-lg font-bold">{title}</p>
                </motion.span>
            )}
        </AnimatePresence>
    );
}