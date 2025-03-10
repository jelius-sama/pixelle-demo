import { createServerClient } from "@/server/supabase/server";
import { isString } from "@/utils";
import ErrorMessages from "@/utils/Messages";
import { ServerRuntime } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const email = formData.get("email");
        const password = formData.get("password");

        if (!email || !password) {
            return NextResponse.json({ error: ErrorMessages.noCredentials }, { status: 400 });
        }

        if (!isString(email) || !isString(password)) {
            return NextResponse.json({ error: ErrorMessages.invalidInputType({ requiredType: "string" }) }, { status: 400 });
        }

        const supabase = createServerClient();
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            console.error("Something went wrong during sign-up: ", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data.session || !data.user) {
            console.log("Either the session or the user object is missing!");

            console.log("session: ", data.session);
            console.log("user: ", data.user);

            return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
        }

        // Success response
        return NextResponse
            .json({
                user: data.user,
                session: data.session,
            }, { status: 201 });
    } catch (error) {
        console.error("Unhandled error during sign-up: ", error);
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
}
