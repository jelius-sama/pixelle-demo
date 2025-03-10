import { createServerClient } from "@/server/supabase/server";
import { isBlob, isString } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const username = formData.get("new_full_name");
        const oldPassword = formData.get("old_password");
        const newPassword = formData.get("new_password");
        const avatar = formData.get("new_avatar");
        const banner = formData.get("new_banner");

        const supabase = createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
        }

        const updates = new Map<string, any>();

        const validate = ({
            data,
            dataTypeBe,
        }: {
            data: string | Blob;
            dataTypeBe: "string" | "blob";
        }): boolean => {
            return dataTypeBe === "string" ? isString(data) : dataTypeBe === "blob" && isBlob(data);
        };

        const returnValidationError = () => {
            return NextResponse.json({ error: "Invalid data provided!" }, { status: 401 });
        };

        if (username) {
            if (!validate({ data: username, dataTypeBe: "string" })) return returnValidationError();
            updates.set("user_name", username);
        }

        if (newPassword) {
            if (!oldPassword || !validate({ data: oldPassword, dataTypeBe: "string" })) {
                return returnValidationError();
            }

            const passwordForm = new FormData();
            passwordForm.append("password", oldPassword as string);
            passwordForm.append("user-id", user.id);

            const res = await fetch(`${new URL(req.url).origin}/api/confirm-password`, {
                method: "POST",
                body: passwordForm,
            });

            if (!res.ok) return returnValidationError();

            if (!validate({ data: newPassword, dataTypeBe: "string" })) return returnValidationError();
            updates.set("password", newPassword);
        }

        const processFileUpload = async (file: Blob, type: "avatar" | "banner") => {
            // Convert and normalize image
            const processedImage = await sharp(await file.arrayBuffer())
                .jpeg({ quality: 80 }) // Compress and standardize to JPEG
                .resize({
                    width: type === 'avatar' ? 300 : 1200,
                    height: type === 'avatar' ? 300 : 600,
                    fit: 'cover'
                })
                .toBuffer();

            const filePath = `${user.id}/${type}.jpeg`;

            // Remove existing file of the same type
            const { data: existingFiles, error: listError } = await supabase.storage
                .from("user-assets")
                .list(user.id, {
                    search: `${type}.jpeg`
                });

            if (listError) throw new Error(`Failed to list existing files: ${listError.message}`);

            // Remove existing file if it exists
            if (existingFiles?.length) {
                const { error: removeError } = await supabase.storage
                    .from("user-assets")
                    .remove([`${user.id}/${existingFiles[0].name}`]);

                if (removeError) throw new Error(`Failed to remove existing file: ${removeError.message}`);
            }

            // Upload new file
            const { error: uploadError } = await supabase.storage
                .from("user-assets")
                .upload(filePath, processedImage, {
                    contentType: "image/jpeg",
                    upsert: true
                });

            if (uploadError) throw new Error(`Failed to upload ${type}: ${uploadError.message}`);

            updates.set(`${type}_file_path`, filePath);
        };

        if (avatar) {
            if (!validate({ data: avatar, dataTypeBe: "blob" })) return returnValidationError();
            await processFileUpload(avatar as Blob, "avatar");
        }

        if (banner) {
            if (!validate({ data: banner, dataTypeBe: "blob" })) return returnValidationError();
            await processFileUpload(banner as Blob, "banner");
        }

        if (updates.has("password")) {
            const newPassword = updates.get("password");
            updates.delete("password"); // Prevent storing password in metadata

            const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
            if (passwordError) throw new Error(`Password update failed: ${passwordError.message}`);
        }

        if (updates.size) {
            const updatePayload = { data: { ...user.user_metadata, ...Object.fromEntries(updates) } };

            const { error: metadataError } = await supabase.auth.updateUser(updatePayload);
            if (metadataError) throw new Error(`Metadata update failed: ${metadataError.message}`);
        }

        return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
