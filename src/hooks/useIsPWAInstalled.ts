import { useState, useEffect } from "react";

interface iOSNavigatorFuckAndroid extends Navigator {
    standalone?: boolean;
}

export default function useIsPWAInstalled() {
    const [isPWAInstalled, setIsPWAInstalled] = useState(false);

    useEffect(() => {
        const checkPWAStatus = () => {
            // Check for display mode (Android/Modern browsers)
            const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

            // Check for iOS-specific property
            const isIOSStandalone = (window.navigator as iOSNavigatorFuckAndroid).standalone === true;

            setIsPWAInstalled(isStandalone || isIOSStandalone);
        };

        checkPWAStatus();

        // Listen for changes in display mode (optional, for dynamic updates)
        const mediaQuery = window.matchMedia("(display-mode: standalone)");
        mediaQuery.addEventListener("change", checkPWAStatus);

        return () => {
            mediaQuery.removeEventListener("change", checkPWAStatus);
        };
    }, []);

    return isPWAInstalled;
}
