import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Photo upload is not configured." }, { status: 500 });
  }

  const form = await request.formData();
  const file = form.get("photo");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing photo file." }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }

  const maxBytes = 6 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "Image is too large (max 6MB)." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const filePath = `photos/${fileName}`;

  const { error } = await supabaseAdmin.storage
    .from("photos")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    return NextResponse.json({ error: "Failed to upload photo." }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from("photos").getPublicUrl(filePath);
  return NextResponse.json({ url: data.publicUrl });
}

