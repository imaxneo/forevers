import { NextResponse } from "next/server";

import { ensureExpiredSquaresDeactivated, supabase, supabaseAdmin } from "@/lib/supabase";
import { PlanType } from "@/lib/types";

export async function POST(request: Request) {
  await ensureExpiredSquaresDeactivated();

  const body = (await request.json()) as {
    position: number;
    name1: string;
    name2: string;
    start_date: string;
    message: string;
    email?: string;
    plan: PlanType;
    photo_url?: string | null;
  };

  if (!body.position || !body.name1 || !body.name2 || !body.start_date || !body.message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (body.message.length > 150) {
    return NextResponse.json({ error: "Message is too long (max 150 chars)." }, { status: 400 });
  }
  if (body.position < 1 || body.position > 10000) {
    return NextResponse.json({ error: "Invalid star position." }, { status: 400 });
  }

  if (supabase) {
    const { data: existing, error } = await supabase
      .from("squares")
      .select("id")
      .eq("grid_position", body.position)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Failed to validate availability." }, { status: 500 });
    }
    if (existing) {
      return NextResponse.json({ error: "This star is already reserved." }, { status: 409 });
    }
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server is not ready for direct reservations." }, { status: 503 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const plan = body.plan === "basic" || body.plan === "featured" || body.plan === "vip" ? body.plan : "featured";
    const expiresAt = plan === "basic" ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString() : null;

    const upsertPayload = {
      grid_position: body.position,
      name1: body.name1,
      name2: body.name2,
      start_date: body.start_date,
      message: body.message,
      plan,
      photo_url: body.photo_url ?? null,
      email: body.email ?? null,
      stripe_session_id: null,
      is_active: true,
      expires_at: expiresAt
    };

    const { data, error } = await supabaseAdmin
      .from("squares")
      .upsert(upsertPayload, { onConflict: "grid_position" })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Could not complete reservation." }, { status: 500 });
    }

    return NextResponse.json({
      url: `${baseUrl}/success?square_id=${encodeURIComponent(data.id)}`
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not complete reservation." },
      { status: 500 }
    );
  }
}
