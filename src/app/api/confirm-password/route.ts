import { createAdminClient, createServerClient } from "@/server/supabase/server";
import { isString } from "@/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const password = formData.get("password");
        const callFromServer = { userId: formData.get("user-id") };

        if (!password) {
            return NextResponse.json({ error: "Password is empty!" }, { status: 400 });
        }

        if (!isString(password)) {
            return NextResponse.json({ error: "Password should be a valid string!" }, { status: 400 });
        }

        const supabase = createAdminClient();
        let userId: string | null;

        if (callFromServer.userId) {
            if (!isString(callFromServer.userId)) {
                console.log("If this was called from server side code make sure that you pass user id as well!");
                return NextResponse.json({ error: "If this was called from server side code make sure that you pass user id as well!" }, { status: 401 });
            }
            userId = callFromServer.userId;
        } else {
            const { data: { user } } = await createServerClient().auth.getUser();
            if (!user) {
                return NextResponse.json({ error: "Could not authorize the user, are you signed in?" }, { status: 500 });
            }
            userId = user.id;
        }

        if (!userId) {
            return NextResponse.json({ error: "Could not authorize the user, are you signed in?" }, { status: 500 });
        }

        const { data, error } = await supabase
            .rpc("get_encrypted_password", { user_id: userId })
            .single() as { data: string | null, error: PostgrestError | null; };

        if (error || !data) {
            console.log("Error: ", error);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, data);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        return NextResponse.json({ message: "Password is correct" }, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
