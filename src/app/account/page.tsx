"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/app/TopNav";

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
      setError("Nhập tên và cụm từ bí mật của bạn.");
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
      setError(data.error ?? "Đã có lỗi xảy ra.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:py-20">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Quay lại
        </Link>
        <TopNav />
      </div>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản"}
      </h1>
      <p className="mt-1 mb-8 text-sm text-slate-500">
        Đăng nhập bằng một <strong>cụm từ bí mật</strong> — một câu bạn dễ nhớ,
        không phải mật khẩu phức tạp.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Tên của bạn
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ví dụ: thien"
            autoFocus
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Cụm từ bí mật
          </label>
          <textarea
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            rows={2}
            placeholder="ví dụ: mèo ăn cơm buổi sáng — một câu dễ nhớ, không phải mật khẩu phức tạp"
            className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-4 text-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <p className="mt-1 text-xs text-slate-400">
            Chọn một câu chỉ mình bạn nghĩ ra. Dễ nhớ, khó đoán. (ít nhất 8 ký
            tự)
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
            ? "Vui lòng đợi…"
            : mode === "login"
              ? "Đăng nhập"
              : "Tạo tài khoản"}
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
          ? "Chưa có tài khoản? Tạo ngay"
          : "Đã có tài khoản? Đăng nhập"}
      </button>
    </main>
  );
}
