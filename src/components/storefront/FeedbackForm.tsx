"use client";

import { useRef, useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";

const MIN_TEXT = 10;
const MAX_TEXT = 600;
const MAX_NAME = 60;

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_TEXT - text.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (submitting) return;

    const trimmedName = name.trim();
    const trimmedText = text.trim();

    if (trimmedName.length < 2 || trimmedName.length > MAX_NAME) {
      setError(`Name must be between 2 and ${MAX_NAME} characters.`);
      return;
    }
    if (trimmedText.length < MIN_TEXT) {
      setError(`Please write at least ${MIN_TEXT} characters.`);
      return;
    }
    if (trimmedText.length > MAX_TEXT) {
      setError(`Review can be at most ${MAX_TEXT} characters.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          rating,
          text: trimmedText,
          website: honeypotRef.current?.value || "",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setName("");
      setRating(5);
      setText("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-[#fff5fe] rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-[#fcb8fd]" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Thank you, {name.trim()}!
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Your review has been submitted and is now waiting for our team to
          approve it. Once approved, it will show up right here with all the
          other reviews.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 bg-[#fcb8fd] text-white text-sm font-semibold rounded-xl hover:bg-[#d460d6] transition-colors"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-[#fcb8fd] to-[#fcb8fd] rounded-xl flex items-center justify-center">
          <Send className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
          Share Your Feedback
        </h3>
      </div>
      <p className="text-gray-500 mb-8 max-w-lg">
        Tell us about your experience with Arcure Pharma. Your review goes to
        our team for approval before it appears on this page.
      </p>

      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ahmed Ali"
            maxLength={MAX_NAME}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#fcb8fd] focus:border-transparent transition-all text-gray-900 outline-none"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            {name.length}/{MAX_NAME}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                className="p-1 transition-transform hover:scale-110 active:scale-95"
                aria-label={`${s} star`}
              >
                <Star
                  className={`w-7 h-7 ${
                    s <= (hoverStar || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm font-semibold text-gray-700">
              {rating}/5
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience â€” what did you order and how was it?"
            rows={5}
            maxLength={MAX_TEXT}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#fcb8fd] focus:border-transparent transition-all text-gray-900 outline-none resize-none"
          />
          <p
            className={`text-[11px] mt-1 ${
              remaining < 50 ? "text-amber-600 font-semibold" : "text-gray-400"
            }`}
          >
            {remaining}/{MAX_TEXT} characters left Â· minimum {MIN_TEXT}
          </p>
        </div>

        {/* Honeypot â€” hidden from real users, bots love to fill it */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            ref={honeypotRef}
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#fcb8fd] to-[#fcb8fd] text-white font-semibold rounded-xl hover:from-[#d460d6] hover:to-[#fcb8fd] transition-all active:scale-95 shadow-lg shadow-[#fcb8fd]/25 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit for Approval
            </>
          )}
        </button>
        <p className="text-xs text-gray-400">
          Reviews are moderated by our team before they go live.
        </p>
      </div>
    </form>
  );
}


