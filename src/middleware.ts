import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/server/supabase/server";

const setCustomHeaders = ({ request, response }: { request: NextRequest; response: NextResponse; }) => {
    response.headers.set("x-current-path", request.nextUrl.pathname);
    response.headers.set("x-current-url", request.nextUrl.href);
    response.headers.set("x-origin", request.nextUrl.origin);
};


export async function middleware(request: NextRequest): Promise<NextResponse> {
    const { response, supabase } = createMiddlewareClient(request);
    await supabase.auth.getUser(); // To revalidate user so that the session is refreshed and the user does not gets logged out.

    if (process.env.NODE_ENV !== "production") {
        const xForwardedHost = response.headers.get('x-forwarded-host');

        if (xForwardedHost && xForwardedHost.includes('github')) {
            response.headers.set('x-forwarded-host', 'localhost:5500');
        }
    }

    setCustomHeaders({ request: request, response: response }); // Sets some useful headers which can be used in Server-Rendered Page.

    if (request.nextUrl.pathname === '/') {
        const rewriteResponse = NextResponse.rewrite(new URL('/home', request.url));
        setCustomHeaders({ request: request, response: rewriteResponse });
        return rewriteResponse;
    }

    return response;
}

export const config = {
    matcher: [
        // Match all routes except static files and APIs
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
