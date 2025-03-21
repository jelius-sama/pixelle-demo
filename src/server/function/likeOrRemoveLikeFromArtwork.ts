// "use server";

// import { createAdminClient, createServerClient } from "@/server/supabase/server";
// import { PredefinedList, UUID } from "@/server/database/schema";

// export type ExpectedStatus = 200 | 401 | 500;
// type OperationPerformed = "RemovedLike" | "Liked" | null;
// export type ExpectedMessages =
//     "Successfully liked the artwork." |
//     "Unauthorized" |
//     "Something went wrong!" |
//     "Successfully removed your like from the artwork.";

// export default async function likeOrRemoveLikeFromArtwork({ artId }: { artId: bigint; }): Promise<{ status: ExpectedStatus | (number & {}), message: ExpectedMessages | (string & {}); operation: OperationPerformed; }> {
//     const { data: { user }, error } = await createServerClient().auth.getUser();

//     if (!user) {
//         return { status: 401, message: "Unauthorized", operation: null };
//     }

//     if (error) {
//         return { status: 500, message: "Something went wrong!", operation: null };
//     }

//     const supabase = createAdminClient();
//     const userId = user.id;

//     try {
//         // Fetch the current `likes` array for the artwork
//         const { data: artwork, error: fetchError } = await supabase
//             .from("artworks")
//             .select("likes")
//             .eq("id", artId)
//             .single();

//         if (fetchError || !artwork) {
//             console.error("Error fetching artwork data:", fetchError);
//             return { status: 500, message: "Something went wrong!", operation: null };
//         }

//         const currentLikes: PredefinedList[] = artwork.likes || [];

//         // Check if the user has already liked the artwork
//         const existingLikeIndex = currentLikes.findIndex(like => like.uid === userId);

//         if (existingLikeIndex !== -1) {
//             // Remove the user's like
//             const updatedLikes = currentLikes.filter(like => like.uid !== userId);

//             // Update the likes array in the database
//             const { error: updateError } = await supabase
//                 .from("artworks")
//                 .update({ likes: updatedLikes })
//                 .eq("id", artId);

//             if (updateError) {
//                 console.error("Error updating artwork likes:", updateError);
//                 return { status: 500, message: "Something went wrong!", operation: null };
//             }

//             return { status: 200, message: "Successfully removed your like from the artwork.", operation: "RemovedLike" };
//         } else {
//             // Add the user's like with the current timestamp
//             const updatedLikes = [
//                 ...currentLikes,
//                 { uid: userId, timestamp: new Date().toISOString() },
//             ];

//             // Update the likes array in the database
//             const { error: updateError } = await supabase
//                 .from("artworks")
//                 .update({ likes: updatedLikes })
//                 .eq("id", artId);

//             if (updateError) {
//                 console.error("Error updating artwork likes:", updateError);
//                 return { status: 500, message: "Something went wrong!", operation: null };
//             }

//             return { status: 200, message: "Successfully liked the artwork.", operation: "Liked" };
//         }
//     } catch (error) {
//         console.error("Unexpected error in likeOrRemoveLikeFromArtwork:", error);
//         return { status: 500, message: "Something went wrong!", operation: null };
//     }
// }



"use server";

import { createAdminClient, createServerClient } from "@/server/supabase/server";
import { PredefinedList, UUID } from "@/server/database/schema";

export type ExpectedStatus = 200 | 401 | 500;
type OperationPerformed = "RemovedLike" | "Liked" | null;
export type ExpectedMessages =
    "Successfully liked the artwork." |
    "Unauthorized" |
    "Something went wrong!" |
    "Successfully removed your like from the artwork.";

export default async function likeOrRemoveLikeFromArtwork({ artId }: { artId: string; }): Promise<{ status: ExpectedStatus | (number & {}), message: ExpectedMessages | (string & {}); operation: OperationPerformed; }> {
    const { data: { user }, error } = await createServerClient().auth.getUser();

    if (!user) {
        return { status: 401, message: "Unauthorized", operation: null };
    }

    if (error) {
        return { status: 500, message: "Something went wrong!", operation: null };
    }

    const supabase = createAdminClient();
    const userId = user.id;

    try {
        // Fetch the current likes and dislikes array for the artwork
        const { data: artwork, error: fetchError } = await supabase
            .from("artworks")
            .select("likes, dislikes")
            .eq("id", artId)
            .single();

        if (fetchError || !artwork) {
            console.error("Error fetching artwork data:", fetchError);
            return { status: 500, message: "Something went wrong!", operation: null };
        }

        const currentLikes: PredefinedList[] = artwork.likes || [];
        const currentDislikes: PredefinedList[] = artwork.dislikes || [];

        // Check if the user has already disliked the artwork
        const existingDislikeIndex = currentDislikes.findIndex(dislike => dislike.uid === userId);

        if (existingDislikeIndex !== -1) {
            // Remove the user's dislike
            const updatedDislikes = currentDislikes.filter(dislike => dislike.uid !== userId);

            // Update the dislikes array in the database
            const { error: updateDislikeError } = await supabase
                .from("artworks")
                .update({ dislikes: updatedDislikes })
                .eq("id", artId);

            if (updateDislikeError) {
                console.error("Error updating artwork dislikes:", updateDislikeError);
                return { status: 500, message: "Something went wrong!", operation: null };
            }
        }

        // Check if the user has already liked the artwork
        const existingLikeIndex = currentLikes.findIndex(like => like.uid === userId);

        if (existingLikeIndex !== -1) {
            // Remove the user's like
            const updatedLikes = currentLikes.filter(like => like.uid !== userId);

            // Update the likes array in the database
            const { error: updateLikeError } = await supabase
                .from("artworks")
                .update({ likes: updatedLikes })
                .eq("id", artId);

            if (updateLikeError) {
                console.error("Error updating artwork likes:", updateLikeError);
                return { status: 500, message: "Something went wrong!", operation: null };
            }

            return { status: 200, message: "Successfully removed your like from the artwork.", operation: "RemovedLike" };
        } else {
            // Add the user's like with the current timestamp
            const updatedLikes = [
                ...currentLikes,
                { uid: userId, timestamp: new Date().toISOString() },
            ];

            // Update the likes array in the database
            const { error: updateLikeError } = await supabase
                .from("artworks")
                .update({ likes: updatedLikes })
                .eq("id", artId);

            if (updateLikeError) {
                console.error("Error updating artwork likes:", updateLikeError);
                return { status: 500, message: "Something went wrong!", operation: null };
            }

            return { status: 200, message: "Successfully liked the artwork.", operation: "Liked" };
        }
    } catch (error) {
        console.error("Unexpected error in likeOrRemoveLikeFromArtwork:", error);
        return { status: 500, message: "Something went wrong!", operation: null };
    }
}