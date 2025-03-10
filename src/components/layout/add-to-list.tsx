"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UUID } from "@/server/database/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { atom, useAtom } from "jotai";
import { useEffect, useState, useCallback } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { List } from "@/app/api/function/user-lists/route";
import { PostgrestError } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { isString } from "@/utils";
import ActivityIndicator from "@/components/ui/activity-indicator";
import { useThemeColor } from "@/hooks/useThemeColor";

async function getLatestLists() {
  const response = await fetch("/api/function/user-lists", { method: "GET" });
  const resJson = (await response.json()) as {
    data: List[] | null;
    error: { name: string; details: PostgrestError | unknown } | null;
  };

  if (!response.ok) {
    if (resJson.error) {
      console.error(resJson.error);
      return {
        error: resJson.error,
        data: null,
      };
    } else {
      console.error("Network error!");
      return {
        error: {
          name: "Check your internet connection!",
          details: "Network error!",
        },
        data: null,
      };
    }
  }

  return { data: resJson.data, error: null };
}

async function toggleListItem(listId: string, artworkId: number) {
  const response = await fetch("/api/function/user-lists/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listId, artworkId }),
  });

  const resJson = (await response.json()) as {
    error: {
      code: string;
      message: string;
      details: unknown;
    } | null;
    success: boolean;
    message: string | null;
    action: string | null;
  };

  if (!response.ok) {
    if (resJson.error) {
      console.error(resJson.error);
      return {
        error: resJson.error,
        success: false,
        action: null,
        message: null,
      };
    } else {
      console.error("Network error!");
      return {
        error: {
          code: "NETWORK_ERROR",
          message: "Check your internet connection",
          details: "Network error!",
        },
        success: false,
        action: null,
        message: null,
      };
    }
  }

  return {
    action: resJson.action,
    message: resJson.message,
    success: resJson.success,
    error: null,
  };
}

async function getListsContainingArtwork(artworkId: number) {
  const response = await fetch(`/api/function/user-lists/items/${artworkId}`);
  const resJson = (await response.json()) as {
    data: string[] | null;
    error: { name: string; details: Error } | null;
  };

  if (!response.ok) {
    if (resJson.error) {
      console.error(resJson.error);
      throw new Error(resJson.error.name);
    } else {
      console.error("Network error!");
      throw new Error("Check your internet connection!");
    }
  }

  return resJson.data;
}

async function createNewList(newListTitle: string) {
  const response = await fetch("/api/function/user-lists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newListTitle }),
  });

  if (!response.ok) {
    console.error("Network error!");
    return {
      error: "Check your internet connection!",
      success: false,
    };
  }

  const resJson = (await response.json()) as {
    error: string | null;
    success: boolean;
  };

  if (resJson.error) {
    console.error(resJson.error);
  }

  return resJson;
}

export interface AddToListState {
  isMenuOpen: boolean;
  itemData: {
    userId: UUID;
    artworkId: number;
  } | null;
}

export const addToListAtom = atom<AddToListState>({
  isMenuOpen: false,
  itemData: null,
});

// Custom hook for list operations with optimistic updates
function useListOperations(artworkId: number | null) {
  const [lists, setLists] = useState<List[] | "loading" | null>("loading");
  const [listContainingArtwork, setListContainingArtwork] = useState<string[]>(
    []
  );
  const [pendingOperations, setPendingOperations] = useState<
    Record<string, { action: "add" | "remove"; status: "pending" | "error" }>
  >({});

  const fetchLists = useCallback(async () => {
    if (!artworkId) return;
    setLists("loading");

    const [listsResult, containingResult] = await Promise.all([
      getLatestLists(),
      getListsContainingArtwork(artworkId),
    ]);

    console.log("lists: ", listsResult);
    console.log("containingResult: ", containingResult);

    if (listsResult.data) {
      setLists(listsResult.data);
    } else {
      toast.error(
        listsResult.error
          ? listsResult.error.name
          : "Failed to fetch your lists!"
      );
      setLists([]);
    }

    if (containingResult) {
      setListContainingArtwork(containingResult);
    }
  }, [artworkId]);

  // Helper to check if a list contains the artwork (considering pending operations)
  const isInList = useCallback(
    (listId: string) => {
      const pending = pendingOperations[listId];
      if (pending) {
        return pending.action === "add";
      }
      return listContainingArtwork.includes(listId);
    },
    [listContainingArtwork, pendingOperations]
  );

  // Optimistic update handler
  const handleToggle = useCallback(
    async (checked: CheckedState, listId: string, artworkId: number) => {
      // Determine the action based on the checkbox state
      const action = checked === true ? "add" : "remove";

      // Skip if indeterminate or already pending
      if (
        checked === "indeterminate" ||
        pendingOperations[listId]?.status === "pending"
      ) {
        return;
      }

      // Optimistically update the UI
      setPendingOperations((prev) => ({
        ...prev,
        [listId]: { action, status: "pending" },
      }));

      // If adding, optimistically add to the list
      if (action === "add") {
        setListContainingArtwork((prev) => [...prev, listId]);
      } else {
        // If removing, optimistically remove from the list
        setListContainingArtwork((prev) => prev.filter((id) => id !== listId));
      }

      try {
        const result = await toggleListItem(listId, artworkId);

        if (!result.success) {
          // Revert the optimistic update on failure
          setPendingOperations((prev) => ({
            ...prev,
            [listId]: { action, status: "error" },
          }));

          // Revert the list state
          if (action === "add") {
            setListContainingArtwork((prev) =>
              prev.filter((id) => id !== listId)
            );
          } else {
            setListContainingArtwork((prev) => [...prev, listId]);
          }

          toast.error(
            result.error ? result.error.message : "Failed to update list"
          );
        } else {
          // Clear the pending operation on success
          setPendingOperations((prev) => {
            const newPending = { ...prev };
            delete newPending[listId];
            return newPending;
          });

          // Show success toast
          toast.success(result.message);
        }
      } catch (error) {
        // Handle any unexpected errors
        setPendingOperations((prev) => ({
          ...prev,
          [listId]: { action, status: "error" },
        }));
        toast.error("An unexpected error occurred");
      }
    },
    [pendingOperations]
  );

  return {
    lists,
    listContainingArtwork,
    pendingOperations,
    fetchLists,
    setLists,
    handleToggle,
    isInList,
  };
}

export function AddToList() {
  const [listStatus, setListStatus] = useAtom(addToListAtom);

  const {
    lists,
    pendingOperations,
    fetchLists,
    setLists,
    handleToggle,
    isInList,
  } = useListOperations(
    listStatus.itemData ? listStatus.itemData.artworkId : null
  );

  const [creatingNewList, setCreatingNewList] = useState(false);

  useEffect(() => {
    if (!listStatus.isMenuOpen) {
      setLists(null);
    } else {
      setLists("loading");
      fetchLists();
    }
  }, [listStatus.isMenuOpen, fetchLists]);

  const createList = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    const formData = new FormData(formEvent.currentTarget);
    const listTitle = formData.get("list-title");

    if (!listTitle) {
      toast.error("List title not provided!");
      return;
    }

    if (!isString(listTitle)) {
      toast.error("Invalid title type!");
      return;
    }

    setCreatingNewList(true);

    (async () => {
      const response = await createNewList(listTitle);
      if (response.error) {
        toast.error(response.error);
      } else {
        fetchLists();
        toast.success("New list created!");
      }

      setCreatingNewList(false);
    })();
  };

  const foregroundColor = useThemeColor("foreground");

  return (
    <Dialog
      open={listStatus.isMenuOpen}
      onOpenChange={(open) =>
        setListStatus((prev) => ({
          isMenuOpen: open,
          itemData: open ? prev.itemData : null,
        }))
      }
    >
      <DialogContent className="w-full max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Save to list</DialogTitle>
          <DialogDescription>
            Save artworks to your list so they are never lost in abyss of a
            million artworks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {lists === "loading" ? (
            <Spinner />
          ) : lists && lists.length > 0 ? (
            lists.map((list) => {
              const isPending =
                pendingOperations[list.id]?.status === "pending";
              const isError = pendingOperations[list.id]?.status === "error";

              return (
                <div key={list.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={list.id}
                    onCheckedChange={(checked) =>
                      listStatus.itemData &&
                      handleToggle(
                        checked,
                        list.id,
                        listStatus.itemData.artworkId
                      )
                    }
                    checked={isInList(list.id)}
                    disabled={isPending}
                    className={isError ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor={list.id}
                    className={`${isPending ? "opacity-50" : ""} 
                                                  ${
                                                    isError
                                                      ? "text-red-500"
                                                      : ""
                                                  }`}
                  >
                    {list.title}
                    {isPending && " (Updating...)"}
                    {isError && " (Failed - try again)"}
                  </Label>
                </div>
              );
            })
          ) : (
            <Label>No lists available.</Label>
          )}

          <form
            onSubmit={(formEvent) => createList(formEvent)}
            className="flex w-full items-center space-x-2 pt-4"
          >
            <Input
              autoComplete="off"
              name="list-title"
              type="text"
              placeholder="Create new list"
            />
            <Button
              disabled={creatingNewList}
              type="submit"
              variant={"secondary"}
            >
              {creatingNewList && (
                <ActivityIndicator size={36} color={foregroundColor} />
              )}
              Create
            </Button>
          </form>
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() =>
              setListStatus((prev) => ({
                ...prev,
                isMenuOpen: false,
              }))
            }
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
