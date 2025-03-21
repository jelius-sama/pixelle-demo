import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get the URL from search params
        const url = request.nextUrl.searchParams.get('url');

        if (!url) {
            return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
        }

        const targetUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/${url}`;

        // Forward all headers except host
        const headers = new Headers(request.headers);
        headers.delete('host');

        // Make the request to the target endpoint
        const response = await fetch(targetUrl, {
            method: request.method,
            headers,
        });

        // Create a new response with the same status, headers, and body
        const proxyResponse = new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });

        return proxyResponse;
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to proxy request' },
            { status: 500 }
        );
    }
}