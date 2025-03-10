"use client";

import { useState, useEffect } from "react";

export default function useDeviceType() {
    const [isMobile, setIsMobile] = useState(false);
    const [deviceType, setDeviceType] = useState<"desktop" | "mobile" | "unknown">("unknown");

    useEffect(() => {
        if (typeof navigator === 'undefined') return;
        const userAgent = navigator.userAgent.toLowerCase();

        // Mobile detection
        const mobileRegex = /iphone|ipad|android|mobile|blackberry|iemobile|kindle|silk|opera mini/;
        const isMobileDevice = mobileRegex.test(userAgent);

        // Desktop detection
        const desktopRegex = /windows|macintosh|linux|x11/;
        const isDesktopDevice = desktopRegex.test(userAgent);

        setIsMobile(isMobileDevice);
        setDeviceType(isMobileDevice ? "mobile" : isDesktopDevice ? "desktop" : "unknown");
    }, []);

    return { isMobile, deviceType };
}
