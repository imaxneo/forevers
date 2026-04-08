"use client";

import { useState } from "react";

export function CopySquareLinkButton({ squareId }: { squareId: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="btn-secondary px-4 py-2 text-sm"
      onClick={async () => {
        const base = typeof window !== "undefined" ? window.location.origin : "";
        const url = `${base}/square/${squareId}`;
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "Link copied" : "Copy Link"}
    </button>
  );
}

