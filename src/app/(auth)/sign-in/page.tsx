import AuthInput from "@/components/layout/auth-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MarginedContent from "@/components/ui/margined-content";
import { SubmitButton } from "@/components/ui/submit-button";
import { AlertCircle } from "lucide-react";
import type { Metadata, ServerRuntime } from "next";
import Link from "next/link";
import { createServerClient } from "@/server/supabase/server";
import getUserOrRedirect from "@/utils/get-user";
import { encodedRedirect, isString, toastToClient } from "@/utils";
import ErrorMessages, { ServerMessage, ServerMessageStatus } from "@/utils/Messages";
import type { UserMetadata } from "@/types";

export const metadata: Metadata = {
    title: "Sign in"
};

export default async function SignInPage(props: { searchParams: Promise<{ error: string; } | null>; }) {
    await getUserOrRedirect({ redirectTo: 'home' });
    const searchParams = await props.searchParams;

    const signIn = async (formData: FormData) => {
        "use server";

        const email = formData.get("email");
        const password = formData.get("password");

        if (!email || !password) return encodedRedirect({ path: '/sign-in', type: 'error', params: { error: ErrorMessages.noCredentials } });
        if (!isString(email) || !isString(password)) return encodedRedirect({ path: '/sign-in', type: 'error', params: { error: ErrorMessages.invalidInputType({ requiredType: "string" }) } });

        const supabase = createServerClient();
        const { error, data } = await supabase.auth.signInWithPassword({ password: password, email: email });

        if (error) {
            console.error("Something went wrong when someone tried to sign in: ", error);
            return encodedRedirect({ type: 'error', path: "/sign-in", params: { error: error.message } });
        } else {
            const msg: ServerMessage['msg'] = `Successfully signed in as ${(data.user.user_metadata as UserMetadata).user_name}`;
            return toastToClient({ status: ServerMessageStatus.success, path: "/", serverMessage: msg });
        }
    };

    return (
        <MarginedContent className={`flex flex-col items-center justify-center`}>
            <form action={signIn}
                className="flex flex-col w-full max-w-[calc(28rem_+_4rem)] gap-x-1.5 gap-y-4 p-5 border rounded-md">
                <p className="font-bold text-lg">Sign in</p>
                {searchParams && searchParams.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {searchParams.error}
                        </AlertDescription>
                    </Alert>
                )}
                <AuthInput context="sign-in" />
                <SubmitButton type="submit">Sign in</SubmitButton>
            </form>

            <span className="flex flex-row gap-x-1 w-full justify-center items-center mt-4">
                <p>Don&apos;t have an account?</p>
                <Link href={'/sign-up'} className="text-blue-600 transition-all duration-300 hover:opacity-90">Sign up</Link>
            </span>
        </MarginedContent>
    );
}