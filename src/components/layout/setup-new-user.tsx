"use client";

import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { SubmitButton } from '@/components/ui/submit-button';
import AuthInput from '@/components/layout/auth-input';
import { isFile, isString } from '@/utils';
import ErrorMessages from '@/utils/Messages';
import { Session } from '@supabase/supabase-js';
import { User } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/server/supabase/client';
import imageCompression, { type Options } from "browser-image-compression";
import { UUID } from '@/server/database/schema';

async function uploadFileToSupabase(
    buffer: Buffer,
    format: string,
    userId: UUID,
    type: 'avatar' | "banner",
): Promise<string> {
    const supabase = createBrowserClient();
    const filePath = `${userId}/${type}.${format}`; // Set the file path

    // Upload the file to Supabase Storage
    const { error } = await supabase.storage
        .from("user-assets") // Replace with your bucket name
        .upload(filePath, buffer, {
            contentType: `image/${format}`, // Set the content type
            upsert: true, // Overwrite the file if it exists
        });

    if (error) {
        toast.dismiss("signup_setup");
        toast.error("Failed to upload file.");
    }

    return filePath;
}

async function saveToUserDatabase({
    key,
    value,
}: {
    key: "avatar_file_path" | "banner_file_path" | "user_name";
    value: string;
}) {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.updateUser({
        data: {
            [key]: value, // Dynamically set the property name
        },
    });

    if (error) {
        toast.dismiss("signup_setup");
        console.log(error);
        toast.error("Something went wrong when saving to database.");
    }
}

const options: Options = {
    maxSizeMB: 1, // Maximum size in MB
    maxWidthOrHeight: 1920, // Maximum width or height
    useWebWorker: true, // Use web worker for faster processing
};

async function setUpNewUser({
    avatar,
    banner,
    user,
    username,
}: {
    avatar: FormDataEntryValue | null;
    banner: FormDataEntryValue | null;
    user: User;
    username: FormDataEntryValue;
}) {
    if (isString(username)) {
        await saveToUserDatabase({ key: "user_name", value: username });
    } else {
        toast.dismiss("signup_setup");
        toast.error("Something went wrong when parsing Username.");
    }

    if (isFile(avatar) && avatar.size > 0) {
        const data = await imageCompression(avatar, options);

        if (!data) {
            toast.dismiss("signup_setting");
            toast.error("Something went wrong when compressing the image.");

            return;
        }

        // Assume the format is derived from the file type, e.g., 'jpeg', 'png', etc.
        const format = avatar.type.split("/")[1]; // Get the format from the MIME type

        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage and get the file path
        const filePath = await uploadFileToSupabase(
            buffer,
            format,
            user.id,
            'avatar',
        );

        await saveToUserDatabase({ key: "avatar_file_path", value: filePath });
    }

    if (isFile(banner) && banner.size > 0) {
        const data = await imageCompression(banner, options);

        if (!data) {
            toast.dismiss("signup_setup");
            toast.error("Something went wrong when compressing the image.");

            return;
        }

        // Assume the format is derived from the file type, e.g., 'jpeg', 'png', etc.
        const format = banner.type.split("/")[1]; // Get the format from the MIME type

        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage and get the file path
        const filePath = await uploadFileToSupabase(
            buffer,
            format,
            user.id,
            "banner",
        );

        await saveToUserDatabase({ key: "banner_file_path", value: filePath });
    }
}

export default function SetupNewUser({ searchParams }: { searchParams: { error: string; } | null; }) {
    const [error, setError] = useState<{ error: string; } | null>(null);
    const router = useRouter();
    const [pending, setPending] = useState<boolean>(false);

    const signUp = async (formData: FormData) => {
        try {
            const response = await fetch("/api/sign-up", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                setError({ error: (response.json() as any).error });
            }

            const data = await response.json() as { user: User, session: Session; };
            return { user: data.user, session: data.session };
        } catch (error) {
            setError({ error: "An unexpected error occurred." });
            return { user: null, session: null };
        }
    };

    async function validateForm(e: React.FormEvent<HTMLFormElement>) {
        setPending(true);
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirm-password");
        const username = formData.get("full_name");

        if (!email || !password || !username) return setError({ error: ErrorMessages.noCredentials });
        if (!isString(email) || !isString(password) || !isString(confirmPassword) || (!isString(username))) return setError({ error: ErrorMessages.invalidInputType({ requiredType: "string" }) });

        if (password !== confirmPassword) return setError({ error: "Passwords does not match!" });

        const { user, session } = await signUp(formData);

        if (!user || !session) {
            const errorMsg = "Something went wrong when trying to setup profile.";
            toast.error(errorMsg);
            setPending(false);
            router.replace(`/sign-up?error=${errorMsg}`);
        } else {
            toast.loading("Account created, setting up your profile.", {
                id: "signup_setup",
            });
            await setUpNewUser({
                username: username,
                avatar: formData.get("avatar"),
                banner: formData.get("banner"),
                user: user,
            });
            toast.dismiss('signup_setup');
            toast.success("Profile setup successfully!");
            setPending(false);
            router.replace('/profile');
        }
    }

    return (
        <form onSubmit={(e) => validateForm(e)} className="flex flex-col w-full max-w-[calc(28rem_+_4rem)] gap-x-1.5 gap-y-4 p-5 border rounded-md">
            <p className="font-bold text-lg">Sign up</p>
            {((searchParams && searchParams.error) || (error && error.error)) && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {searchParams && searchParams.error}
                        {error && <><br />{error.error}</>}
                    </AlertDescription>
                </Alert>
            )}

            <AuthInput isPending={pending} context="sign-up" />
            <SubmitButton className='mt-4' loading={pending} type="submit">Sign up</SubmitButton>
        </form>
    );
}
