"use client";

import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import ActivityIndicator from "@/components/ui/activity-indicator";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = ComponentProps<typeof Button> & {
    pendingText?: string;
    loading?: boolean;
};

export function SubmitButton({ children, pendingText, variant = "default", loading = false, ...props }: Props) {
    const { pending } = useFormStatus();
    const foregroundColor = useThemeColor('foreground');
    const backgroundColor = useThemeColor('background');

    return (
        <Button
            aria-disabled={pending || loading}
            disabled={pending || loading}
            type="submit"
            variant={variant}
            {...props}
        >
            {(pending || loading) && (
                <ActivityIndicator size={36} color={variant === "default" ? backgroundColor : variant === "secondary" ? foregroundColor : foregroundColor} />
            )}
            {(pending || loading) && pendingText ? pendingText : children}
        </Button>
    );
}
