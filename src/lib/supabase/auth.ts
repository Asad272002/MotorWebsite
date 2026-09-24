import "server-only";

import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type AuthenticatedProfile = Readonly<{
  userId: string;
  profile: Omit<Tables<"profiles">, "created_password">;
}>;

export const getAuthenticatedProfile = cache(async (): Promise<AuthenticatedProfile | null> => {
  const supabase = await createServerSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (userError || typeof userId !== "string") return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active, created_at, updated_at, created_by, revoked_at, revoked_by")
    .eq("id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (profileError || !profile) return null;
  return { userId, profile };
});
