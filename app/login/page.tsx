"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const accounts = {
  Umum: {
    password: "Umum",
    role: "individu",
    dashboard: "/dashboard/individu",
  },
  PIC: {
    password: "PIC",
    role: "uks",
    dashboard: "/dashboard/uks",
  },
  Kepsek: {
    password: "Kepsek",
    role: "kepsek",
    dashboard: "/dashboard/kepsek",
  },
  kapus: {
    password: "kapus",
    role: "puskesmas",
    dashboard: "/dashboard/puskesmas",
  },
};

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const account =
      accounts[username as keyof typeof accounts];

    if (!account || account.password !== password) {
      setError("Username atau password salah.");
      return;
    }

    // Simpan role sementara untuk menentukan akses dashboard
    localStorage.setItem("aeris_role", account.role);
    localStorage.setItem("aeris_username", username);

    router.push(account.dashboard);
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            AERIS
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Air Exposure Risk & Infection Screening System
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-7"
        >
          <h2 className="text-2xl font-bold text-slate-900">
            Login
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-6">
            Masuk ke dashboard AERIS
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Masuk ke AERIS
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5">
          AERIS • Sistem Skrining & Mitigasi Risiko
        </p>

      </div>
    </main>
  );
}