"use client";

import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState("Petugas UKS");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

      <div className="w-full max-w-md">

        <div className="text-center">

          <p className="text-sm font-bold tracking-[0.35em] text-cyan-400">
            AERIS
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            Masuk ke AERIS
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Portal guru dan petugas UKS
          </p>

        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

          <label className="text-sm text-slate-400">
            Masuk sebagai
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3">

            <button
              onClick={() => setRole("Guru")}
              className={`rounded-xl border px-4 py-3 text-sm font-bold ${
                role === "Guru"
                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              Guru
            </button>

            <button
              onClick={() => setRole("Petugas UKS")}
              className={`rounded-xl border px-4 py-3 text-sm font-bold ${
                role === "Petugas UKS"
                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              Petugas UKS
            </button>

          </div>

          <label className="mt-6 block text-sm text-slate-400">
            Email
          </label>

          <input
            type="email"
            placeholder="nama@sekolah.sch.id"
            className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <label className="mt-5 block text-sm text-slate-400">
            Password
          </label>

          <input
            type="password"
            placeholder="••••••••"
            className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <a
            href="/dashboard"
            className="mt-6 block w-full rounded-xl bg-cyan-400 px-5 py-4 text-center font-bold text-slate-950 hover:bg-cyan-300"
          >
            Masuk sebagai {role}
          </a>

        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Prototype AERIS — autentikasi database akan ditambahkan
          pada tahap berikutnya.
        </p>

      </div>

    </main>
  );
}