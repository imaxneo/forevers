import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { ensureExpiredSquaresDeactivated, supabaseAdmin } from "@/lib/supabase";

type LemonWebhookPayload = {
  meta?: {
    event_name?: string;
    custom_data?: Record<string, string | undefined>;
  };
  data?: {
    id?: string;
    attributes?: {
      identifier?: string;
      user_email?: string;
    };
  };
};

export async function POST(request: Request) {
  await ensureExpiredSquaresDeactivated();

  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ received: true, skipped: true });
  }

  const signature = headers().get("x-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const digest = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
  if (digest !== signature) {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }
  const eventBody = JSON.parse(body) as LemonWebhookPayload;

  if (eventBody.meta?.event_name === "order_created") {
    const metadata = eventBody.meta?.custom_data;
    const orderId = eventBody.data?.id;
    const orderIdentifier = eventBody.data?.attributes?.identifier;

    if (metadata && supabaseAdmin) {
      const plan = metadata.plan === "basic" || metadata.plan === "featured" || metadata.plan === "vip"
        ? metadata.plan
        : "featured";
      const position = Number(metadata.position);
      if (!Number.isInteger(position) || position < 1 || position > 10000) {
        return NextResponse.json({ received: true, skipped: true, reason: "invalid_position" });
      }

      const { data: existing } = await supabaseAdmin
        .from("squares")
        .select("id,is_active,stripe_session_id")
        .eq("grid_position", position)
        .maybeSingle();

      const paymentRef = orderIdentifier || orderId || "";
      if (existing?.is_active && existing.stripe_session_id !== paymentRef) {
        return NextResponse.json({ received: true, skipped: true, reason: "already_reserved" });
      }

      const expiresAt = plan === "basic" ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString() : null;
      const squarePayload = {
        grid_position: position,
        name1: metadata.name1,
        name2: metadata.name2,
        start_date: metadata.start_date,
        message: metadata.message,
        plan,
        photo_url: metadata.photo_url || null,
        stripe_session_id: paymentRef,
        email: metadata.email || eventBody.data?.attributes?.user_email || null,
        is_active: true,
        expires_at: expiresAt
      };

      const { error } = await supabaseAdmin.from("squares").upsert(squarePayload, {
        onConflict: "grid_position"
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
