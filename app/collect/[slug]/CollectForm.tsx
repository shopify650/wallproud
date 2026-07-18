"use client";

import { useState, useCallback, useRef } from "react";
import { Star, ArrowRight, ArrowLeft, Camera, Check } from "lucide-react";
import toast from "react-hot-toast";
import { submitTestimonial, uploadVideo } from "@/app/actions/collect";

function fireConfetti(color: string) {
  const colors = [color, "#818cf8", "#a5b4fc"];
  const duration = 2000;
  const end = Date.now() + duration;
  const frame = () => {
    for (const x of [0, 1]) {
      const count = 3;
      for (let i = 0; i < count; i++) {
        const size = 6 + Math.random() * 6;
        const el = document.createElement("div");
        el.style.position = "fixed";
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.left = `${x * 100 + (Math.random() * 20 - 10)}vw`;
        el.style.top = "-10px";
        el.style.borderRadius = "2px";
        el.style.zIndex = "100";
        el.style.pointerEvents = "none";
        document.body.appendChild(el);
        const fall = 100 + Math.random() * 40;
        const drift = (Math.random() - 0.5) * 30;
        el.animate(
          [
            { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
            {
              transform: `translate(${drift}vw, ${fall}vh) rotate(${Math.random() * 720}deg)`,
              opacity: 0,
            },
          ],
          { duration: 1500 + Math.random() * 1000, easing: "cubic-bezier(.2,.8,.2,1)" },
        ).onfinish = () => el.remove();
      }
    }
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

function StarSelector({
  value,
  onChange,
  color,
}: {
  value: number | null;
  onChange: (v: number) => void;
  color: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <Star
            className={`h-12 w-12 transition-all ${
              display && star <= display
                ? "fill-current"
                : "fill-none text-gray-300"
            }`}
            style={{
              color: display && star <= display ? color : undefined,
            }}
          />
        </button>
      ))}
    </div>
  );
}

function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i <= current
              ? "w-8 bg-indigo-600"
              : "w-2 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function CollectForm({
  token,
  workspaceColor,
}: {
  token: string;
  workspaceColor: string;
}) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [form, setForm] = useState({
    rating: null as number | null,
    content: "",
    author_name: "",
    author_company: "",
    author_role: "",
    author_email: "",
    video_url: null as string | null,
  });

  const update = useCallback(
    (field: string, value: any) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const rec = new MediaRecorder(stream, { mimeType: "video/webm" });
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideoBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      toast.error("Camera access denied");
    }
  };

  const stopRecording = () => {
    mediaRecRef.current?.stop();
    setRecording(false);
  };

  const canNext = () => {
    if (step === 0) return form.rating != null;
    if (step === 1) return form.content.trim().length > 0 && form.author_name.trim().length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let uploadedUrl: string | undefined;
      if (videoBlob) {
        const uploadRes = await uploadVideo(token, videoBlob);
        if (uploadRes.error) {
          toast.error(uploadRes.error);
          setSubmitting(false);
          return;
        }
        uploadedUrl = uploadRes.url;
        setForm((prev) => ({ ...prev, video_url: uploadRes.url! }));
      }

      const videoUrl = videoBlob ? uploadedUrl : form.video_url;
      const res = await submitTestimonial(token, {
        author_name: form.author_name,
        author_email: form.author_email,
        author_company: form.author_company,
        author_role: form.author_role,
        content: form.content,
        rating: form.rating,
        video_url: videoUrl,
      });

      if (res.error === "already_submitted") {
        toast("You already submitted feedback!", { icon: "👋" });
        setDone(true);
        fireConfetti(workspaceColor);
        return;
      }

      if (res.error) {
        toast.error(res.error);
        setSubmitting(false);
        return;
      }

      setDone(true);
      fireConfetti(workspaceColor);
    } catch {
      toast.error("Something went wrong");
    }
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="px-6 py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Thank you for your feedback!
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Your testimonial has been submitted and is awaiting review.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <StepIndicator current={step} total={4} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) {
            setStep((s) => s + 1);
          } else {
            handleSubmit();
          }
        }}
        className="mt-8"
      >
        {/* Step 0: Rating */}
        {step === 0 && (
          <div className="space-y-6 text-center">
            <p className="text-lg font-medium text-gray-700">
              How would you rate your experience?
            </p>
            <StarSelector
              value={form.rating}
              onChange={(v) => update("rating", v)}
              color={workspaceColor}
            />
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-5">
            <p className="text-lg font-medium text-gray-700">
              What stood out to you?
            </p>
            <textarea
              required
              rows={4}
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="Tell us what you loved most..."
              className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2"
              style={{ outlineColor: workspaceColor }}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.author_name}
                onChange={(e) => update("author_name", e.target.value)}
                placeholder="Jane Doe"
                className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  value={form.author_company}
                  onChange={(e) => update("author_company", e.target.value)}
                  placeholder="Acme Inc"
                  className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  value={form.author_role}
                  onChange={(e) => update("author_role", e.target.value)}
                  placeholder="CEO"
                  className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email (for verification)
              </label>
              <input
                type="email"
                value={form.author_email}
                onChange={(e) => update("author_email", e.target.value)}
                placeholder="jane@example.com"
                className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2"
              />
            </div>
          </div>
        )}

        {/* Step 2: Video */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            <p className="text-lg font-medium text-gray-700">
              Want to add a video testimonial?
            </p>

            {!videoBlob ? (
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                className="mx-auto flex items-center gap-3 rounded-2xl border-2 border-dashed border-indigo-200 px-8 py-6 text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
              >
                <Camera className="h-8 w-8" />
                <div className="text-left">
                  <p className="font-medium">
                    {recording ? "Stop recording" : "Record a video"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {recording ? "Click to stop" : "Uses your webcam"}
                  </p>
                </div>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto h-40 w-full max-w-xs overflow-hidden rounded-xl bg-gray-100">
                  <video
                    ref={videoRef}
                    src={URL.createObjectURL(videoBlob)}
                    controls
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoBlob(null)}
                    className="text-sm text-gray-500 underline hover:text-gray-700"
                  >
                    Re-record
                  </button>
                  <span className="text-xs text-green-600">
                    <Check className="mr-1 inline h-3 w-3" />
                    Video attached
                  </span>
                </div>
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-sm text-gray-400 underline hover:text-gray-600"
              >
                Skip and submit text only
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Submit */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
              <Check className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Ready to submit?
              </p>
              {videoBlob && (
                <p className="mt-1 text-sm text-gray-500">
                  Your testimonial includes a video attachment
                </p>
              )}
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-left text-sm text-gray-600 italic">
              &ldquo;{form.content.substring(0, 150)}
              {form.content.length > 150 ? "..." : ""}&rdquo;
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 ${
              step === 0 ? "invisible" : ""
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="submit"
            disabled={!canNext() || submitting}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: workspaceColor }}
            onMouseEnter={(e) => {
              if (!submitting && canNext()) {
                e.currentTarget.style.filter = "brightness(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "";
            }}
          >
            {submitting
              ? "Submitting..."
              : step < 3
                ? "Continue"
                : "Submit feedback"}
            {step < 3 && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
