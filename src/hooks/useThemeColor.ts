import { useEffect, useState } from "react";

// Define the color scheme types
type ThemeType = "background" | "foreground";

// Define the theme configuration
interface ThemeConfig {
    media: "(prefers-color-scheme: light)" | "(prefers-color-scheme: dark)";
    background: "#09090b" | "#ffffff";
    foreground: "#fafafa" | "#09090b";
}

const themeColor: ThemeConfig[] = [
    { media: "(prefers-color-scheme: light)", background: "#ffffff", foreground: "#09090b" },
    { media: "(prefers-color-scheme: dark)", background: "#09090b", foreground: "#fafafa" },
];

// Hook: Takes a "background" or "foreground" as a parameter
export function useThemeColor<T extends ThemeType>(type: T): T extends "background" ? "#09090b" | "#ffffff" : "#fafafa" | "#09090b" {
    const [themeColorState, setThemeColorState] = useState<"#ffffff" | "#fafafa" | "#09090b">(themeColor[0][type]);

    useEffect(() => {
        const updateThemeColor = () => {
            for (const theme of themeColor) {
                if (window.matchMedia(theme.media).matches) {
                    setThemeColorState(theme[type]);
                    return;
                }
            }
        };

        // Run on component mount
        updateThemeColor();

        // Set up event listeners for theme changes
        const mediaQueryLists = themeColor.map((theme) =>
            window.matchMedia(theme.media)
        );

        mediaQueryLists.forEach((mql) => {
            mql.addEventListener("change", updateThemeColor);
        });

        // Cleanup listeners on unmount
        return () => {
            mediaQueryLists.forEach((mql) => {
                mql.removeEventListener("change", updateThemeColor);
            });
        };
    }, [type]);

    return themeColorState as T extends "background" ? "#09090b" | "#ffffff" : "#fafafa" | "#09090b";
};
