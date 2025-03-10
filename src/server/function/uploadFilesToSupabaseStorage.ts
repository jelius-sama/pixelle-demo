"use server";

import { createAdminClient } from "@/server/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { UUID } from "@/server/database/schema";

export type ExpectedMessages = "Unexpected error occurred during the upload process." | "Files uploaded successfully." | "Error uploading file. Please try again." | "No files provided for upload.";
export type ExpectedStatus = 200 | 400 | 500;

export type UploadResponse =
    | { status: 200, message: "Files uploaded successfully.", files: { url: string, filePath: string; }[]; }
    | { status: 400 | 500, message: ExpectedMessages, files?: undefined; };

/** Utility function to upload an array of files to Supabase Storage */
export default async function uploadFilesToStorage({
    files,
    artistId,
    bucketName
}: {
    bucketName: string,
    files: File[] | Blob[],
    artistId: UUID;
}): Promise<UploadResponse> {

    const supabase = createAdminClient();

    // Check for empty files array
    if (!files || files.length === 0) {
        return { status: 400, message: "No files provided for upload." };
    }

    const uploadedFiles: { url: string, filePath: string; }[] = [];

    try {
        for (const file of files) {
            // Generate a unique file name using UUID and Current Date to avoid overwriting
            const fileName = `${uuidv4()}_${Date.now()}`;
            const filePath = `${artistId}/${fileName}`;

            // Upload the file to Supabase Storage
            const { error } = await supabase.storage.from(bucketName).upload(filePath, file);

            if (error) {
                console.error(`Error uploading file: `, error.message);
                return { status: 500, message: "Error uploading file. Please try again." };
            }

            // Generate the URL for the uploaded file
            const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);

            // Push the URL and filename to the array
            uploadedFiles.push({ url: publicUrl, filePath: filePath });
        }

        // Return the array of files with URLs and filenames if everything went fine
        return { status: 200, message: "Files uploaded successfully.", files: uploadedFiles };
    } catch (err) {
        console.error("Unexpected error during file upload: ", err);
        return { status: 500, message: "Unexpected error occurred during the upload process." };
    }
}
