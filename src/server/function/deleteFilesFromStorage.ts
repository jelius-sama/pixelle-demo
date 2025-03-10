"use server";

import { createAdminClient } from "@/server/supabase/server";

export type ExpectedMessages = "Files deleted successfully." | "Error deleting files. Please try again." | "Unexpected error occurred during the deletion process.";
export type ExpectedStatus = 200 | 400 | 500;

/** Utility function to delete an array of files from Supabase Storage */
export default async function deleteFilesFromStorage({
    filePaths,
    bucketName,
}: {
    filePaths: string[];
    bucketName: string;
}): Promise<{ status: ExpectedStatus | (number & {}), message: ExpectedMessages | (string & {}); }> {
    const supabase = createAdminClient();

    // Ensure there are files to delete
    if (!filePaths || filePaths.length === 0) {
        return { status: 400, message: "No files provided for deletion." };
    }

    try {
        // Try to remove each file from Supabase Storage
        for (const filePath of filePaths) {
            const { error } = await supabase.storage.from(bucketName).remove([filePath]);
            if (error) {
                console.error(`Error deleting file ${filePath}:`, error.message);
                return { status: 500, message: "Error deleting files. Please try again." };
            }
        }

        // Return success message if all files were deleted
        return { status: 200, message: "Files deleted successfully." };
    } catch (err) {
        // Log any unexpected error during the file deletion process
        console.error("Unexpected error during file deletion:", err);
        return { status: 500, message: "Unexpected error occurred during the deletion process." };
    }
}
