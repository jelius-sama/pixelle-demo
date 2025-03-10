"use client";

import { atom, useAtom } from "jotai";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ActivityIndicator from "@/components/ui/activity-indicator";
import { toast } from "sonner";
import { useThemeColor } from "@/hooks/useThemeColor";
import { usePathname } from "next/navigation";

export const deleteListAtom = atom<{ listId: string; } | null>(null);

export function DeleteList() {
    const [listStatus, setListStatus] = useAtom(deleteListAtom);
    const [deletingList, setDeletingList] = useState(false);
    const pathname = usePathname();

    async function requestDelete(listId: string) {
        const response = await fetch('/api/function/user-lists', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ listId: listId, actionPerformedAt: pathname }),
        });

        if (!response.ok) {
            console.error("Network error!");
            return {
                error: "Check your internet connection!",
                success: false
            };
        }

        const resJson = await response.json() as { error: string | null, success: boolean; };

        if (resJson.error) {
            console.error(resJson.error);
        }

        return resJson;
    }

    const confirmDeleteList = () => {
        setDeletingList(true);

        (async () => {
            if (!listStatus) {
                toast.error("Failed to delete list, try again later!");
                setDeletingList(false);
                return;
            }

            const status = await requestDelete(listStatus.listId);

            if (!status.success) {
                toast.error("Failed to delete list, try again later!");
                setDeletingList(false);
                return;
            } else {
                setDeletingList(false);
                setListStatus(null);
                toast.success("Successfully deleted the list!");
            }
        })();
    };

    const foregroundColor = useThemeColor('foreground');

    return (
        <Dialog
            open={listStatus !== null}
            onOpenChange={(open) => setListStatus(prev => (open && prev ? {
                listId: prev.listId
            } : null))}
        >
            <DialogContent className="w-full max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Delete list</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this list, this action is not reversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => setListStatus(null)}
                    >
                        Cancel
                    </Button>

                    <Button disabled={deletingList} onClick={() => confirmDeleteList()} variant={"secondary"}>
                        {deletingList && <ActivityIndicator size={36} color={foregroundColor} />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}