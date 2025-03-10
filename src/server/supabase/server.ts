import { createServerClient as serverClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from 'next/server';

export const createMiddlewareClient = (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient();

  return { supabase, response };
};

export const createServerClient = () => {
  const cookieStore = cookies();
  const [SUPABASE_URL, SUPABASE_KEY] = [process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY] as string[];

  return serverClient(
    SUPABASE_URL, SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};

export const createAdminClient = () => {
  const cookieStore = cookies();
  const [SUPABASE_URL, SUPABASE_SERVICE_KEY] = [process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY] as string[];

  return serverClient(
    SUPABASE_URL, SUPABASE_SERVICE_KEY,
    {
      // cookies: {
      //   getAll() {
      //     return cookieStore.getAll();
      //   },
      //   setAll(cookiesToSet) {
      //     try {
      //       cookiesToSet.forEach(({ name, value, options }) => {
      //         cookieStore.set(name, value, options);
      //       });
      //     } catch (error) {
      //       // The `set` method was called from a Server Component.
      //       // This can be ignored if you have middleware refreshing
      //       // user sessions.
      //     }
      //   },
      // },
      cookies: {
        getAll() {
          return [];
        },
      },
    },
  );
};