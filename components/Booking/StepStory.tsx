import { ChangeEvent } from "react";

import { CoupleForm } from "@/lib/types";

export function StepStory({
  form,
  onChange,
  onPhoto
}: {
  form: CoupleForm;
  onChange: (patch: Partial<CoupleForm>) => void;
  onPhoto: (file: File | null) => void;
}) {
  const handleInput =
    (field: keyof CoupleForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ [field]: event.target.value });
    };

  return (
    <div className="booking-step-content space-y-5">
      <div>
        <p className="booking-step-kicker">Step 2</p>
        <h2 className="booking-step-title">Tell your story</h2>
        <p className="booking-step-copy">Keep it short, warm, and memorable.</p>
      </div>

      <div className="booking-form-grid">
        <label className="booking-input-group">
          <span>Your name</span>
          <input value={form.name1} onChange={handleInput("name1")} maxLength={20} className="input-field" />
        </label>

        <label className="booking-input-group">
          <span>Partner&apos;s name</span>
          <input value={form.name2} onChange={handleInput("name2")} maxLength={20} className="input-field" />
        </label>

        <label className="booking-input-group">
          <span>Start date</span>
          <input type="date" value={form.start_date} onChange={handleInput("start_date")} className="input-field" />
        </label>

        <label className="booking-input-group">
          <span>Email (optional)</span>
          <input
            type="email"
            value={form.email ?? ""}
            onChange={handleInput("email")}
            placeholder="for reminders"
            className="input-field"
          />
        </label>
      </div>

      <label className="booking-input-group booking-message-group">
        <span>Your love message</span>
        <textarea
          value={form.message}
          onChange={handleInput("message")}
          maxLength={150}
          rows={3}
          className="input-field booking-message-input"
        />
        <em>{form.message.length}/150</em>
      </label>

      <label className="booking-upload-zone">
        <strong>Upload a photo</strong>
        <small>Square photo works best</small>
        <input type="file" accept="image/*" className="hidden" onChange={(event) => onPhoto(event.target.files?.[0] ?? null)} />
      </label>
    </div>
  );
}
