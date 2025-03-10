// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "pixelle",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_KEY) {
      throw new Error("NEXT_PUBLIC_SUPABASE_KEY is required");
    }
    if (!process.env.SUPABASE_SERVICE_KEY) {
      throw new Error("SUPABASE_SERVICE_KEY is required");
    }
    if (!process.env.KV_URL) {
      throw new Error("KV_URL is required");
    }
    if (!process.env.KV_REST_API_READ_ONLY_TOKEN) {
      throw new Error("KV_REST_API_READ_ONLY_TOKEN is required");
    }
    if (!process.env.KV_REST_API_TOKEN) {
      throw new Error("KV_REST_API_TOKEN is required");
    }
    if (!process.env.KV_REST_API_URL) {
      throw new Error("KV_REST_API_URL is required");
    }
    new sst.aws.Nextjs("PixelleWebApp", {
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
        SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
        KV_URL: process.env.KV_URL,
        KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
        KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
        KV_REST_API_URL: process.env.KV_REST_API_URL,
      }
    });
  },
});
