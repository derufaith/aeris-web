"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "individu" | "uks" | "kepsek" | "puskesmas";

type Account = {
  username: string;
  password: string;
  role: Role;
  nama: string;
};

const akun: Account[] = [
  {
    username: "Umum",
    password: "Umum",
    role: "individu",
    nama: "Pengguna Umum",
  },
  {
    username: "PIC",
    password: "PIC",
    role: "uks",
    nama: "PIC UKS",
  },
  {
    username: "Kepsek",
    password: "Kepsek",
    role: "kepsek",
    nama: "Kepala Sekolah",
  },
  {
    username: "kapus",
    password: "kapus",
    role: "puskesmas",
    nama: "Puskesmas",
  },
];

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function login() {
    if (!username.trim()) {
      alert("Silakan masukkan username.");
      return;
    }

    if (!password) {
      alert("Silakan masukkan password.");
      return;
    }

    setLoading(true);

    // ============================================
    // CARI AKUN
    // ============================================

    const user = akun.find(
      (item) =>
        item.username === username.trim() &&
        item.password === password
    );

    // ============================================
    // LOGIN GAGAL
    // ============================================

    if (!user) {
      alert("Username atau password salah.");
      setLoading(false);
      return;
    }

    // ============================================
    // BERSIHKAN SESSION LAMA
    // ============================================

    localStorage.removeItem("aeris_role");
    localStorage.removeItem("aeris_username");
    localStorage.removeItem("aeris_nama");

    // ============================================
    // SIMPAN SESSION BARU
    // ============================================

    localStorage.setItem("aeris_role", user.role);
    localStorage.setItem("aeris_username", user.username);
    localStorage.setItem("aeris_nama", user.nama);

    console.log("LOGIN BERHASIL");
    console.log("Username:", user.username);
    console.log("Role:", user.role);

    // ============================================
    // REDIRECT
    // ============================================

    switch (user.role) {
      case "individu":
        router.push("/dashboard/individu");
        break;

      case "uks":
        router.push("/dashboard/uks");
        break;

      case "kepsek":
        router.push("/dashboard/kepsek");
        break;

      case "puskesmas":
        router.push("/dashboard/puskesmas");
        break;

      default:
        alert("Role pengguna tidak dikenali.");
        setLoading(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      login();
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10 flex items-center justify-center">

      <div className="w-full max-w-xl">

        {/* HEADER */}

        <div className="text-center mb-10">

          <p className="text-cyan-400 font-bold tracking-[0.3em] text-sm">
            AERIS
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-black">
            Login
          </h1>

          <p className="mt-3 text-slate-400">
            Masuk ke sistem AERIS untuk melanjutkan.
          </p>

        </div>

        {/* CARD */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 md:p-9">

          {/* USERNAME */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-bold text-slate-300">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Masukkan username"
              autoComplete="username"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400"
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-8">

            <label className="mb-2 block text-sm font-bold text-slate-300">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Masukkan password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 pr-24 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 hover:text-cyan-400"
              >
                {showPassword
                  ? "Sembunyikan"
                  : "Lihat"}
              </button>

            </div>

          </div>

          {/* LOGIN */}

          <button
            type="button"
            onClick={login}
            disabled={loading}
            className="w-full rounded-xl bg-cyan-400 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Memproses..."
              : "Masuk ke AERIS →"}
          </button>

          {/* INFO AKUN */}

          <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950 p-5">

            <p className="text-sm font-bold text-slate-300">
              Akses Sistem
            </p>

            <div className="mt-4 space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Individu
                </span>

                <span className="font-bold text-slate-300">
                  Umum / Umum
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  PIC UKS
                </span>

                <span className="font-bold text-cyan-400">
                  PIC / PIC
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Kepala Sekolah
                </span>

                <span className="font-bold text-slate-300">
                  Kepsek / Kepsek
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Puskesmas
                </span>

                <span className="font-bold text-slate-300">
                  kapus / kapus
                </span>
              </div>

            </div>

          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          AERIS — Air Exposure Risk & Infection Screening System
        </p>

      </div>

    </main>
  );
}