"use server";

import { areBlobs, encodedRedirect, isString, isStringArray } from "@/utils";
import { createServerClient } from "@/server/supabase/server";
import { isValidArtType } from "@/server/database/schema";
import uploadFilesToStorage from "@/server/function/uploadFilesToSupabaseStorage";
import deleteFilesFromStorage from "@/server/function/deleteFilesFromStorage";
import { retry } from "@/server/utils";

export type ExpectedStatus = 200 | 400 | 500;
export type ExpectedMessages = "Artwork posted!" | "Invalid request. Please check the input data." | "Something went wrong!" | "Invalid request. Please ensure all files are valid images.";

export default async function postArtwork(formData: FormData): Promise<{ status: ExpectedStatus | (number & {}), message: ExpectedMessages | (string & {}); }> {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return encodedRedirect({ type: 'error', path: '/sign-in', params: { error: "Sign in to post your own artworks!" } });

    try {
        const artwork_type = formData.get('artwork_type');
        const title = formData.get('title');
        const tags = formData.get('tags');
        const description = formData.get('description');
        const images = formData.getAll('images');

        if (
            !isString(artwork_type) ||
            !isValidArtType(artwork_type) ||
            !isString(title) ||
            !isStringArray(tags) ||
            !areBlobs(images) ||
            !(description === null || isString(description))
        ) {
            return { status: 400, message: "Invalid request. Please check the input data." };
        }

        const imagesArr: Blob[] = Array.from(images);

        const invalidImages = imagesArr.filter(image => {
            // Ensure the item is a Blob or File with a valid MIME type
            return !(image.type.startsWith("image/"));
        });

        // If any invalid image is found, return an error
        if (invalidImages.length > 0) {
            return { status: 400, message: "Invalid request. Please ensure all files are valid images." };
        }

        let tagsArr: string[] = [];
        try {
            if (isString(tags)) tagsArr = JSON.parse(tags);
        } catch (e) {
            return { status: 400, message: "Invalid request. Please check the input data." };
        }

        const { status, message, files } = await uploadFilesToStorage({ files: imagesArr, artistId: user.id, bucketName: 'arts' });

        if (status === 200) {
            const { error } = await supabase
                .from('artworks')
                .insert([
                    {
                        artwork_type: artwork_type,
                        title: title,
                        tags: tagsArr,
                        description: description,
                        images: files.map(file => file.url),
                    }
                ]);

            if (error) {
                console.error("Something went wrong when trying to insert into database: ", error);

                // Retry the file deletion process if database insertion failed
                const deleteResult = await retry(() => deleteFilesFromStorage({
                    bucketName: 'arts',
                    filePaths: files.map(file => file.filePath),
                }), 3, 2000); // Retry 3 times with a 2-second delay between each attempt

                if (deleteResult && deleteResult.status !== 200) {
                    return { status: 500, message: "Error deleting files after database failure." };
                }

                return { status: 500, message: "Something went wrong!" };
            }

            console.log("Data inserted successfully!");
            return { status: 200, message: "Artwork posted!" };
        } else {
            return { status: status, message: message };
        }
    } catch (error) {
        console.error("Error inserting data: ", error);
        return { status: 500, message: "Something went wrong!" };
    }
}