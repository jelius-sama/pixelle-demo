import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ContextProviders } from "@/components/context-providers";
import Sidenav from "@/components/layout/sidenav";
import { Toaster } from "@/components/ui/sonner";
import appConfig, { creator } from "@/app.config";
import ServerMessage from "@/components/server-message";
import { Suspense } from "react";
import { createServerClient } from "@/server/supabase/server";
import { GetUserResponse } from "@/types";
import { headers } from "next/headers";
import NavWrapper from "@/components/layout/nav-wrapper";
import BottomNav from "@/components/layout/bottomnav";
import { AddToList } from "@/components/layout/add-to-list";
import { DeleteList } from "@/components/layout/deleteList";
import SignupReminder from "@/components/layout/signup-reminder";

export const generateMetadata = (): Metadata => {
  const origin = headers().get("x-origin") || "https://pixelle.pages.dev";

  return {
    title: appConfig.title,
    description: appConfig.description,
    icons: appConfig.icons,

    manifest: "/manifest.json",

    appleWebApp: appConfig.appleWebApp,

    formatDetection: {
      telephone: false,
    },

    openGraph: {
      type: "website",
      url: origin,
      siteName: appConfig.applicationName,
      title: appConfig.title,
      description: appConfig.description,
      images: appConfig.icons.icon,
    },

    twitter: {
      card: "summary",
      title: appConfig.title,
      description: appConfig.description,
      images: appConfig.icons.icon,
      site: creator.twitterHandle,
      creator: creator.twitterHandle,
    },
  };
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
  viewportFit: "contain",
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
};

const NoScript = () => {
  return (
    <noscript style={{ zIndex: "99999" }}>
      <style>
        {`
              :root {
                --background: 0 0% 100%;
                --foreground: 240 10% 3.9%;
                --card: 0 0% 100%;
                --card-foreground: 240 10% 3.9%;
                --tw-ring-offset-shadow: 0 0 #0000;
                --tw-ring-shadow: 0 0 #0000;
                --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                --muted-foreground: 240 3.8% 46.1%;
                --border: 240 5.9% 90%;
                --secondary: 240 4.8% 95.9%;
                --secondary-foreground: 240 5.9% 10%;
                --ring: 240 5.9% 10%;
                --destructive: 0 84.2% 60.2%;
                --font-feature-settings: "liga" 1, "calt" 1;
                --font-variation-settings: "wght" 700;  
              }
              @media (prefers-color-scheme: dark) {
                :root {
                  --background: 240 10% 3.9%;
                  --foreground: 0 0% 98%;
                  --secondary: 240 3.7% 15.9%;
                  --secondary-foreground: 0 0% 98%;
                  --card: 240 10% 3.9%;
                  --card-foreground: 0 0% 98%;
                  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
                  --tw-ring-offset-shadow: 0 0 #0000;
                  --tw-ring-shadow: 0 0 #0000;
                  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                  --destructive: 0 62.8% 30.6%;
                  --ring: 240 4.9% 83.9%;
                  --border: 240 3.7% 15.9%;
                  --muted-foreground: 240 5% 64.9%;
                }
              }
              .no-js-hide {
                display: none !important;
              }
              html, :host {
                line-height: 1.5;
                -webkit-text-size-adjust: 100%;
                -moz-tab-size: 4;
                tab-size: 4;
                font-size: 16px;
                font-family: theme('fontFamily.sans', ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
                -webkit-tap-highlight-color: transparent;
                font-feature-settings: var(--font-feature-settings, normal);
                font-variation-settings: var(--font-variation-settings, normal);
              }
              *, ::before, ::after {
                box-sizing: border-box;
              }
              body {
                  margin: 0;
                  line-height: inherit;
                  background-color: hsl(var(--background));
                  color: hsl(var(--foreground));
              }
              button {
                font-family: inherit;
                font-feature-settings: inherit;
                font-variation-settings: inherit;
                font-size: 100%;
                font-weight: inherit;
                line-height: inherit;
                letter-spacing: inherit;
                color: inherit;
                margin: 0;
                padding: 0;
                text-transform: none;
              }
              h3 {
                margin: 0;
                font-size: inherit;
                font-weight: inherit;
              }
              a {
                color: inherit;
                text-decoration: inherit;
              }
              @media (min-width: 640px) {
                .sm-max-w-xl {
                  max-width: 36rem /* 576px */;
                }
              }
              .hover\:bg-secondary\/80:hover {
                  background-color: hsl(var(--secondary) / 0.8);
              }
              .focus-visible\:outline-none:focus-visible {
                  outline: 2px solid transparent;
                  outline-offset: 2px;
              }
              .space-y-1\.5 > :not([hidden]) ~ :not([hidden]) {
                  --tw-space-y-reverse: 0;
                  margin-top: calc(0.375rem /* 6px */ * calc(1 - var(--tw-space-y-reverse)));
                  margin-bottom: calc(0.375rem /* 6px */ * var(--tw-space-y-reverse));
              }
              .focus-visible\:ring-offset-2:focus-visible {
                  --tw-ring-offset-width: 2px;
              }
              .focus-visible\:ring-ring:focus-visible {
                  --tw-ring-color: hsl(var(--ring));
              }
              .ring-offset-background {
                  --tw-ring-offset-color: hsl(var(--background));
              }
              .transition-colors {
                  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
                  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                  transition-duration: 150ms;
              }
              .focus-visible\:ring-2:focus-visible {
                  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
                  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
                  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
              }
            `}
      </style>
      <main
        style={{
          width: "calc(100vw - (1rem * 2))",
          height: "calc(100vh - (1rem * 2))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "1rem",
        }}
      >
        <div
          style={{
            borderRadius: "0.5rem",
            borderWidth: "1px",
            borderColor: "hsl(var(--border))",
            borderStyle: "solid",
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            boxShadow:
              "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
            width: "100%",
          }}
          className="sm-max-w-xl"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "1.5rem",
            }}
            className="space-y-1.5"
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.025em",
              }}
            >
              Error
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              JS Disabled
            </p>
          </div>
          <div style={{ padding: "1.5rem", paddingTop: 0 }}>
            <span style={{ color: "hsl(var(--destructive))" }}>
              You need to enable JavaScript to run this app.
            </span>
          </div>
          <div
            style={{
              alignItems: "center",
              padding: "1.5rem",
              paddingTop: 0,
              display: "flex",
              justifyContent: "end",
            }}
          >
            <a
              href="https://gitbuh.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                whiteSpace: "nowrap",
                borderRadius: "calc(0.5rem - 2px)",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: 500,
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                paddingLeft: "1rem",
                paddingRight: "1rem",
                height: "2.5rem",
                backgroundColor: "hsl(var(--secondary))",
                color: "hsl(var(--secondary-foreground))",
              }}
              className="focus-visible:ring-2 ring-offset-background transition-colors focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none hover:bg-secondary/80"
            >
              Return
            </a>
          </div>
        </div>
      </main>
    </noscript>
  );
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = (await supabase.auth.getUser()) as GetUserResponse;

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <NoScript />
        <ContextProviders
          user={user}
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <NavWrapper
            user={user}
            sideNav={<Sidenav user={user} />}
            bottomNav={<BottomNav user={user} />}
          />
          {children}
          {modal}
          <Toaster />
          <SignupReminder />
          <Suspense>
            <ServerMessage />
          </Suspense>
          <AddToList />
          <DeleteList />
        </ContextProviders>
      </body>
    </html>
  );
}
