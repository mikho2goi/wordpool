"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !passphrase.trim()) {
      setError("Enter your name and passphrase.");
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/account/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, passphrase }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:py-20">
      <Link
        href="/"
        className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        ← Back
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-1 mb-8 text-sm text-slate-500">
        Sign in with a <strong>passphrase</strong> — a sentence you&apos;ll
        remember, not a hard password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Your name
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. thien"
            autoFocus
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Passphrase
          </label>
          <textarea
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            rows={2}
            placeholder="e.g. mèo ăn cơm buổi sáng — a memorable phrase, not a complex password"
            className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-4 text-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <p className="mt-1 text-xs text-slate-400">
            Pick a phrase only you would say. Easy to remember, hard to guess.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 active:scale-95 disabled:opacity-50"
        >
          {submitting
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <button
        onClick={() => {
          setMode((m) => (m === "login" ? "register" : "login"));
          setError("");
        }}
        className="mt-6 text-center text-sm text-slate-500 transition hover:text-slate-900"
      >
        {mode === "login"
          ? "New here? Create an account"
          : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
