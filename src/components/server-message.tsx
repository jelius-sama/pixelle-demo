"use client";

import { ServerMessage as ServerMessageType } from '@/utils/Messages';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast as toaster } from 'sonner';

export default function ServerMessage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const lastToastKey = useRef<string | null>(null); // Ref to track the last toasted key

    const serverMessage: ServerMessageType['msg'] | null = searchParams.get('serverMessage');
    const status: ServerMessageType['status'] | null = searchParams.get('status') as ServerMessageType['status'];

    // Generate a unique key using serverMessage, status, and a timestamp
    const toastKey = serverMessage
        ? `${serverMessage}-${status}-${Date.now()}`
        : null;

    const handleDeleteSearchParams = (paramsToDelete: string[]) => {
        const params = new URLSearchParams(searchParams.toString());

        // Remove all specified parameters
        paramsToDelete.forEach((param) => params.delete(param));

        const newQueryString = params.toString();
        const newUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname;

        // Update the URL without re-rendering or triggering navigation
        window.history.replaceState(null, '', newUrl);
    };


    useEffect(() => {
        if (!serverMessage || toastKey === lastToastKey.current) return;

        // Show the toast and update the lastToastKey
        toaster[status || 'info'](serverMessage);

        handleDeleteSearchParams(["serverMessage", "status"]);

        lastToastKey.current = toastKey;
    }, [serverMessage, status, toastKey]);

    return <></>;
}
