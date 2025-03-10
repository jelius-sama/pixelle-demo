import { User } from "@/types";
import { createServerClient } from "@/server/supabase/server";
import { UserMetadata } from "@/types";
import { notFound, redirect, RedirectType } from "next/navigation";
import { AuthError } from "@supabase/supabase-js";

type GetUserOrRedirectReturn<T extends 'home' | 'sign-in' | 'not-found'> =
    T extends 'sign-in'
    ? { user: User; }
    : never;

export default async function getUserOrRedirect<T extends 'home' | 'sign-in' | 'not-found'>({ redirectTo }: { redirectTo: T; }): Promise<GetUserOrRedirectReturn<T>> {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (redirectTo === 'home') {
        if (user) {
            redirect('/', RedirectType.replace);
        }
        return undefined as unknown as GetUserOrRedirectReturn<T>; // Explicitly return for `home`
    }

    if (redirectTo !== 'home') {
        if (!user) {
            if (redirectTo === 'not-found') notFound();
            redirect('/sign-in', RedirectType.replace);
        }
        return {
            user: {
                ...user!,
                user_metadata: user.user_metadata as UserMetadata,
            },
        } as GetUserOrRedirectReturn<T>;
    }

    throw new Error("Unhandled redirectTo value");
}

export async function getUser(): Promise<{ user: User | null, error: AuthError | null; }> {
    const supabase = createServerClient();

    const { data: { user }, error } = await supabase.auth.getUser() as { data: { user: User | null; }, error: AuthError | null; };


    return { user, error };
}