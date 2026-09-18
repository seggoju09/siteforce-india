import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev rather than silently returning no data, so a missing
  // .env.local doesn't look like an empty database.
  console.warn(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copy .env.example to .env.local and fill in your Supabase project's values."
  );
}

// Falls back to a syntactically valid placeholder so the build doesn't crash
// when .env.local hasn't been set up yet (e.g. CI, or a first `next build`).
// Real requests will fail clearly at runtime until real values are set.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
