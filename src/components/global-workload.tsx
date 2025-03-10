import React, { createContext, useContext, useState } from "react";
import postArtwork from "@/server/function/postArtwork";
import { toast } from "sonner";
import likeOrRemoveLikeFromArtwork from "@/server/function/likeOrRemoveLikeFromArtwork";
import dislikeOrRemoveDislikeFromArtwork from "@/server/function/dislikeOrRemoveDislikeFromArtwork";

const WorkloadContext = createContext({
  post: async (formData: FormData) => { },
  postUploading: false,
  likeOrRemoveLike: async (artworkId: bigint, initialLiked: boolean) => { },
  dislikeOrRemoveDislike: async (
    artworkId: bigint,
    initialDisliked: boolean
  ) => { },
  likesState: {} as Record<string, boolean>,
  dislikesState: {} as Record<string, boolean>,
  deleteArtwork: (artId: string) => { },
});

export function WorkloadProvider({ children }: { children: React.ReactNode }) {
  const [postUploading, setPostUploading] = useState(false);
  const [likesState, setLikesState] = useState<Record<string, boolean>>({});
  const [dislikesState, setDislikesState] = useState<Record<string, boolean>>(
    {}
  );

  async function post(formData: FormData) {
    setPostUploading(true);
    const toastId = "POSTING";
    toast.loading("Posting your artwork.", { id: toastId });

    try {
      const { status, message } = await postArtwork(formData);
      if (status === 200) {
        toast.dismiss(toastId);
        toast.success(message);
      } else {
        toast.dismiss(toastId);
        toast.error(message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Something went wrong.");
    } finally {
      setPostUploading(false);
    }
  }

  /**Typescript error for bigint can't be used as index is ignored for testing purpose */
  const likeOrRemoveLike = async (artworkId: bigint, initialLiked: boolean) => {
    // @ts-ignore
    const isLiked = likesState[artworkId] ?? initialLiked;
    // @ts-ignore
    const isDisliked = dislikesState[artworkId] ?? !initialLiked;

    // @ts-ignore
    setLikesState((prev) => ({ ...prev, [artworkId]: !isLiked }));
    // Check against the actual initial state as well
    // @ts-ignore
    if (isDisliked) {
      // @ts-ignore
      setDislikesState((prev) => ({ ...prev, [artworkId]: false }));
    }

    const { status, message } = await likeOrRemoveLikeFromArtwork({
      artId: artworkId,
    });

    if (status !== 200) {
      toast.error(message);
      // @ts-ignore
      setLikesState((prev) => ({ ...prev, [artworkId]: isLiked }));
    } else {
      toast.success(message);
    }
  };

  /**Typescript error for bigint can't be used as index is ignored for testing purpose */
  const dislikeOrRemoveDislike = async (
    artworkId: bigint,
    initialDisliked: boolean
  ) => {
    // @ts-ignore
    const isDisliked = dislikesState[artworkId] ?? initialDisliked;
    // @ts-ignore
    const isLiked = likesState[artworkId] ?? !initialDisliked;

    // @ts-ignore
    setDislikesState((prev) => ({ ...prev, [artworkId]: !isDisliked }));
    // Check against the actual initial state as well
    // @ts-ignore
    if (isLiked) {
      // @ts-ignore
      setLikesState((prev) => ({ ...prev, [artworkId]: false }));
    }

    const { status, message } = await dislikeOrRemoveDislikeFromArtwork({
      artId: artworkId,
    });

    if (status !== 200) {
      toast.error(message);
      // @ts-ignore
      setDislikesState((prev) => ({ ...prev, [artworkId]: isDisliked }));
    } else {
      toast.success(message);
    }
  };

  function deleteArtwork(artId: string) {
    if (!artId) {
      toast.error("Artwork ID is required.");
      return;
    }
    const loadingId = "LOADING";

    toast.loading("Deleting...", { id: loadingId })
    fetch(`/api/delete-art?artId=${encodeURIComponent(artId)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          toast.error(data.error || "Failed to delete artwork.");
        } else {
          toast.success(data.message || "Artwork deleted successfully.");

          // Emit custom event after successful deletion
          const event = new CustomEvent("artDeleted", { detail: { artId } });
          window.dispatchEvent(event);
        }
      })
      .catch(error => {
        console.error("Error deleting artwork:", error);
        toast.error("An error occurred. Please try again.");
      })
      .finally(() => {
        toast.dismiss(loadingId)
      });
  }

  return (
    <WorkloadContext.Provider
      value={{
        post,
        postUploading,
        likeOrRemoveLike,
        dislikeOrRemoveDislike,
        likesState,
        dislikesState,
        deleteArtwork
      }}
    >
      {children}
    </WorkloadContext.Provider>
  );
}

export function useWorkload() {
  return useContext(WorkloadContext);
}
