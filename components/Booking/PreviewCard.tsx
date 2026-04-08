"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { pricing } from "@/lib/constants";
import { CoupleForm } from "@/lib/types";
import { buildImageFallback, formatStartDate } from "@/lib/utils";

export function PreviewCard({ form }: { form: CoupleForm }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!form.photo) {
      setBlobUrl(null);
      return;
    }
    const url = URL.createObjectURL(form.photo);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.photo]);

  const photoSrc = blobUrl ?? form.photo_url ?? buildImageFallback(`${form.name1 || "Love"} ${form.name2 || "Story"}`);

  return (
    <div className="glass-panel overflow-hidden rounded-[1.4rem] border border-rose-200/20 shadow-card">
      <div className="border-b border-white/10 px-5 py-3">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold-light">Live Preview</p>
      </div>
      <div className="space-y-4 p-5">
        <div className="relative mx-auto aspect-square w-36 overflow-hidden rounded-full border border-gold/30">
          <Image src={photoSrc} alt="Preview" fill className="object-cover" unoptimized />
        </div>
        <div className="text-center">
          <h3 className="font-display text-3xl italic text-white">
            {form.name1 || "Your Name"} &amp; {form.name2 || "Partner"}
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            Together since {form.start_date ? formatStartDate(form.start_date) : "your first day"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-center text-sm text-text-secondary">
          {form.message || "Your love message will appear here on the wall and on your share card."}
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
          <div>
            <p className="font-medium text-white">{pricing[form.plan].label}</p>
            <p className="text-text-secondary">{pricing[form.plan].tagline}</p>
          </div>
          <p className="font-mono text-gold-light">
            ${pricing[form.plan].amount} {pricing[form.plan].cadence}
          </p>
        </div>
      </div>
    </div>
  );
}
