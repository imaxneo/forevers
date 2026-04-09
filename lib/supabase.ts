import { createClient } from "@supabase/supabase-js";

import { demoActivity, demoStats, localSpotlightSquare } from "@/lib/constants";
import { ActivityItem, SquareRecord, WallStats } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabase
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false
      }
    })
  : null;

export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      })
    : null;

export async function ensureExpiredSquaresDeactivated() {
  if (!supabaseAdmin) return;
  const nowIso = new Date().toISOString();
  await supabaseAdmin
    .from("squares")
    .update({ is_active: false })
    .eq("is_active", true)
    .not("expires_at", "is", null)
    .lt("expires_at", nowIso);
}

export async function getActiveSquares(): Promise<SquareRecord[]> {
  if (!supabase) {
    return [localSpotlightSquare];
  }
  await ensureExpiredSquaresDeactivated();

  const { data, error } = await supabase
    .from("squares")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [localSpotlightSquare];
  }

  return data as SquareRecord[];
}

export async function getWallStats(): Promise<WallStats> {
  if (!supabase) {
    return {
      total_taken: 1,
      total_remaining: 9999,
      featured_taken: 1,
      featured_remaining: 199,
      vip_taken: 0
    };
  }
  await ensureExpiredSquaresDeactivated();

  const { data, error } = await supabase
    .from("squares")
    .select("plan")
    .eq("is_active", true);
  if (error || !data) {
    return demoStats;
  }

  const totalTaken = data.length;
  const featuredTaken = data.filter((item) => item.plan === "featured").length;
  const vipTaken = data.filter((item) => item.plan === "vip").length;

  return {
    total_taken: totalTaken,
    total_remaining: Math.max(0, 10000 - totalTaken),
    featured_taken: featuredTaken,
    featured_remaining: Math.max(0, 200 - featuredTaken),
    vip_taken: vipTaken
  };
}

export async function getLatestActivity(): Promise<ActivityItem[]> {
  if (!supabase) {
    return [
      {
        id: localSpotlightSquare.id,
        name1: localSpotlightSquare.name1,
        name2: localSpotlightSquare.name2,
        grid_position: localSpotlightSquare.grid_position,
        country_code: localSpotlightSquare.country_code ?? null,
        created_at: localSpotlightSquare.created_at
      }
    ];
  }
  await ensureExpiredSquaresDeactivated();

  const { data, error } = await supabase
    .from("squares")
    .select("id,name1,name2,grid_position,country_code,created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error || !data) {
    return [
      {
        id: localSpotlightSquare.id,
        name1: localSpotlightSquare.name1,
        name2: localSpotlightSquare.name2,
        grid_position: localSpotlightSquare.grid_position,
        country_code: localSpotlightSquare.country_code ?? null,
        created_at: localSpotlightSquare.created_at
      }
    ];
  }

  return data as ActivityItem[];
}

export async function getSquareById(id: string): Promise<SquareRecord | null> {
  if (!supabase) {
    return id === localSpotlightSquare.id ? localSpotlightSquare : null;
  }

  const { data, error } = await supabase.from("squares").select("*").eq("id", id).single();
  if (error || !data) {
    return id === localSpotlightSquare.id ? localSpotlightSquare : null;
  }
  return data as SquareRecord;
}

export async function getSquareByStripeSessionId(sessionId: string): Promise<SquareRecord | null> {
  if (!supabase) return null;
  await ensureExpiredSquaresDeactivated();
  const { data, error } = await supabase
    .from("squares")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (error || !data) return null;
  return data as SquareRecord;
}
