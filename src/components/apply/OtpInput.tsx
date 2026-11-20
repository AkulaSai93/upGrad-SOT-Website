"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

export const OTP_LENGTH = 6;

/**
 * A one-time code as six boxes. Typing moves to the next box, Backspace to
 * the previous one, the arrows move between them, and pasting a code (or
 * the phone's SMS autofill, via autocomplete="one-time-code" on the first
 * box) fills them all.
 */
export function OtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const focus = (i: number) =>
    boxes.current[Math.max(0, Math.min(OTP_LENGTH - 1, i))]?.focus();

  /** write digits over the boxes from i on, and move to the box after them */
  const fill = (i: number, digits: string) => {
    const next = (
      value.slice(0, i) +
      digits +
      value.slice(i + digits.length)
    ).slice(0, OTP_LENGTH);
    onChange(next);
    focus(i + digits.length);
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      // clear this box, or the one before it if this one is already empty;
      // the digits after it move up one
      const at = value[i] ? i : i - 1;
      if (at < 0) return;
      onChange(value.slice(0, at) + value.slice(at + 1));
      focus(at);
    } else if (e.key === "ArrowLeft") {
      focus(i - 1);
    } else if (e.key === "ArrowRight") {
      focus(i + 1);
    }
  };

  const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "");
    if (digits) fill(i, digits);
  };

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {Array.from({ length: OTP_LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            boxes.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={i === 0}
          maxLength={OTP_LENGTH}
          aria-label={`Digit ${i + 1}`}
          value={value[i] ?? ""}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            if (digits)
              fill(Math.min(i, value.length), digits.slice(-OTP_LENGTH));
          }}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={(e) => onPaste(i, e)}
          onFocus={(e) => e.target.select()}
          className="aspect-square w-full rounded-[6px] border border-black/[0.1] bg-white text-center text-[20px] font-semibold text-ink outline-none transition-colors focus:border-ink"
        />
      ))}
    </div>
  );
}
