"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { StepSquare } from "@/components/Booking/StepSquare";
import { StepStory } from "@/components/Booking/StepStory";
import { CoupleForm } from "@/lib/types";

const steps = ["Square", "Story"];

async function uploadPhotoViaApi(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("photo", file);
  const response = await fetch("/api/upload-photo", {
    method: "POST",
    body: formData
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? "Photo upload failed.");
  }
  return payload.url ?? null;
}

function getFirstAvailable(takenSet: Set<number>) {
  for (let i = 1; i <= 10000; i += 1) {
    if (!takenSet.has(i)) return i;
  }
  return 1;
}

export function BookingFlow({
  initialPosition = 1547,
  takenPositions = []
}: {
  initialPosition?: number;
  takenPositions?: number[];
}) {
  const router = useRouter();
  const takenSet = useMemo(() => new Set(takenPositions), [takenPositions]);
  const safeInitial = takenSet.has(initialPosition) ? getFirstAvailable(takenSet) : initialPosition;
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CoupleForm>({
    position: safeInitial,
    name1: "",
    name2: "",
    start_date: "",
    message: "",
    email: "",
    photo: null,
    plan: "featured"
  });

  const canContinue = useMemo(() => {
    if (step === 0) return form.position > 0 && form.position <= 10000 && !takenSet.has(form.position);
    if (step === 1) return Boolean(form.name1 && form.name2 && form.start_date && form.message);
    return true;
  }, [form, step, takenSet]);

  const submit = async () => {
    setLoading(true);
    try {
      let photoUrl = form.photo_url;
      if (form.photo) {
        photoUrl = await uploadPhotoViaApi(form.photo);
        if (!photoUrl) {
          alert("Photo upload failed. Please try again.");
          return;
        }
        setForm((prev) => ({ ...prev, photo_url: photoUrl }));
      }

      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position: form.position,
          name1: form.name1,
          name2: form.name2,
          start_date: form.start_date,
          message: form.message,
          email: form.email,
          plan: form.plan,
          photo_url: photoUrl ?? null
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        alert(payload.error ?? "Could not reserve this star. Please try another one.");
        return;
      }
      if (payload.url) {
        window.location.href = payload.url;
        return;
      }
      router.push(
        `/success?demo=1&name1=${encodeURIComponent(form.name1)}&name2=${encodeURIComponent(
          form.name2
        )}&position=${form.position}&message=${encodeURIComponent(form.message)}&photo_url=${encodeURIComponent(
          photoUrl ?? ""
        )}`
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong while reserving your star.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-flow-shell mx-auto mt-8 max-w-5xl">
      <div className="booking-stepper" aria-label="Booking steps">
        {steps.map((label, index) => {
          const active = step === index;
          const done = step > index;
          return (
            <div
              key={label}
              aria-current={active ? "step" : undefined}
              className={`booking-step-chip ${active ? "is-active" : ""} ${done ? "is-done" : ""}`}
            >
              <span>{index + 1}</span>
              {label}
            </div>
          );
        })}
      </div>

      <section className="booking-stage" aria-live="polite">
        {step === 0 ? (
          <StepSquare
            position={form.position}
            takenPositions={takenPositions}
            onPick={(position) =>
              setForm((prev) => ({
                ...prev,
                position: Number.isFinite(position) ? Math.max(1, Math.min(10000, position)) : prev.position
              }))
            }
          />
        ) : null}

        {step === 1 ? (
          <StepStory
            form={form}
            onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            onPhoto={(file) => setForm((prev) => ({ ...prev, photo: file }))}
          />
        ) : null}

      </section>

      <div className="booking-flow-footer">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          className="btn-secondary disabled:opacity-40"
        >
          Back
        </button>
        {step < 1 ? (
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setStep((value) => Math.min(1, value + 1))}
            className="cta-primary disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!canContinue || loading}
            className="cta-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Reserving..." : "Reserve Now"}
          </button>
        )}
      </div>
    </div>
  );
}
