import MarginedContent from "@/components/ui/margined-content";
import type { Metadata, ServerRuntime } from "next";
import Link from "next/link";
import getUserOrRedirect from "@/utils/get-user";
import { headers } from "next/headers";
import SetupNewUser from "@/components/layout/setup-new-user";

export const metadata: Metadata = {
    title: "Sign up"
};

export default async function SignUpPage(props: { searchParams: Promise<{ error: string; } | null>; }) {
    const searchParams = await props.searchParams;
    const path = headers().get('x-current-path');
    await getUserOrRedirect({ redirectTo: 'home' });

    return (
        <MarginedContent className={`flex flex-col items-center justify-center`}>
            <SetupNewUser searchParams={searchParams} />

            <span className="flex flex-row gap-x-1 w-full justify-center items-center mt-4">
                <p>Already have an account?</p>
                <Link href={'/sign-in'} className="text-blue-600 transition-all duration-300 hover:opacity-90">Sign in</Link>
            </span>
        </MarginedContent>
    );
}