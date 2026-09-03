"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

// ============================================
// TIPE DATA
// ============================================

type UserData = {
  id: string;
  nama: string;
  no_hp: string;
  jenis_pengguna: string;
  kelas: string;
};

type ScreeningData = {
  id: string;
  skor: number;
  hasil: string;
  created_at: string;
};

// ============================================
// DASHBOARD INDIVIDU
// ============================================

export default function IndividuDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [screenings, setScreenings] = useState<ScreeningData[]>([]);

  const [loading, setLoading] = useState(true);

  // ============================================
  // LOAD DATA
  // ============================================

  useEffect(() => {
    async function loadData() {
      try {
        // ----------------------------------------
        // AMBIL IDENTITAS DARI LOCAL STORAGE
        // ----------------------------------------

        const savedUser = localStorage.getItem("aeris_user");

        if (!savedUser) {
          router.push("/identitas");
          return;
        }

        const userData: UserData = JSON.parse(savedUser);

        setUser(userData);

        // ----------------------------------------
        // AMBIL RIWAYAT SCREENING
        // ----------------------------------------

        const { data, error } = await supabase
          .from("screenings")
          .select("*")
          .eq("user_id", userData.id)
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error("SUPABASE ERROR:", error);
          return;
        }

        setScreenings(data ?? []);
      } catch (error) {
        console.error("ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  // ============================================
  // LOGOUT
  // ============================================

  function logout() {
    localStorage.removeItem("aeris_user");
    localStorage.removeItem("aeris_role");
    localStorage.removeItem("aeris_username");
    localStorage.removeItem("aeris_nama");

    router.push("/login");
  }

  // ============================================
  // FORMAT TANGGAL
  // ============================================

  function formatTanggal(tanggal: string) {
    return new Date(tanggal).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  // ============================================
  // WARNA STATUS
  // ============================================

  function statusClass(hasil: string) {
    const value = hasil.toLowerCase();

    if (
      value.includes("rendah") ||
      value.includes("normal")
    ) {
      return "border-green-500/30 bg-green-500/10 text-green-400";
    }

    if (
      value.includes("perhatian") ||
      value.includes("waspada")
    ) {
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    }

    return "border-red-500/30 bg-red-500/10 text-red-400";
  }

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

        <div className="text-center">

          <p className="text-cyan-400 font-bold tracking-[0.3em] text-sm">
            AERIS
          </p>

          <p className="mt-4 text-slate-400">
            Memuat dashboard...
          </p>

        </div>

      </main>
    );
  }

  // ============================================
  // JIKA USER TIDAK ADA
  // ============================================

  if (!user) {
    return null;
  }

  // ============================================
  // STATISTIK
  // ============================================

  const jumlahScreening = screenings.length;

  const screeningTerakhir =
    screenings.length > 0
      ? screenings[0]
      : null;

  // ============================================
  // UI
  // ============================================

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">

      <div className="mx-auto w-full max-w-6xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-cyan-400 font-bold tracking-[0.3em] text-sm">
              AERIS
            </p>

            <h1 className="mt-2 text-3xl md:text-4xl font-black">
              Dashboard Individu
            </h1>

            <p className="mt-2 text-slate-400">
              Pantau riwayat screening Anda.
            </p>

          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-red-400 hover:text-red-400"
          >
            Keluar
          </button>

        </header>

        {/* ======================================
            IDENTITAS
        ====================================== */}

        <section className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-bold text-slate-500">
                IDENTITAS PENGGUNA
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {user.nama}
              </h2>

              <p className="mt-2 text-slate-400">
                {user.jenis_pengguna}
                {user.kelas
                  ? ` • ${user.kelas}`
                  : ""}
              </p>

            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Screening
              </p>

              <p className="mt-1 text-3xl font-black text-cyan-400">
                {jumlahScreening}
              </p>

            </div>

          </div>

        </section>

        {/* ======================================
            STAT CARD
        ====================================== */}

        <section className="mb-6 grid gap-4 md:grid-cols-2">

          {/* SKOR TERAKHIR */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm font-bold text-slate-500">
              SKOR TERAKHIR
            </p>

            <div className="mt-4 flex items-end gap-3">

              <p className="text-5xl font-black text-cyan-400">
                {screeningTerakhir
                  ? screeningTerakhir.skor
                  : "—"}
              </p>

              {screeningTerakhir && (
                <p className="mb-2 text-sm text-slate-500">
                  / 60
                </p>
              )}

            </div>

          </div>

          {/* STATUS TERAKHIR */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm font-bold text-slate-500">
              STATUS TERAKHIR
            </p>

            <div className="mt-4">

              {screeningTerakhir ? (
                <span
                  className={`inline-flex rounded-xl border px-4 py-3 text-sm font-black ${statusClass(
                    screeningTerakhir.hasil
                  )}`}
                >
                  {screeningTerakhir.hasil}
                </span>
              ) : (
                <p className="text-slate-600">
                  Belum melakukan screening
                </p>
              )}

            </div>

          </div>

        </section>

        {/* ======================================
            ACTION
        ====================================== */}

        <section className="mb-6">

          <button
            onClick={() => router.push("/screening")}
            className="w-full rounded-2xl bg-cyan-400 px-6 py-5 text-lg font-black text-slate-950 transition hover:bg-cyan-300"
          >
            + Mulai Screening Baru
          </button>

        </section>

        {/* ======================================
            RIWAYAT
        ====================================== */}

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">

          <div className="mb-6">

            <p className="text-sm font-bold text-cyan-400 tracking-wider">
              DATA SCREENING
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Riwayat Screening
            </h2>

          </div>

          {screenings.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">

              <p className="text-slate-400">
                Belum ada riwayat screening.
              </p>

              <button
                onClick={() => router.push("/screening")}
                className="mt-4 text-sm font-bold text-cyan-400 hover:text-cyan-300"
              >
                Mulai screening pertama →
              </button>

            </div>

          ) : (

            <div className="space-y-3">

              {screenings.map((item, index) => (

                <div
                  key={item.id ?? index}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-5 md:flex-row md:items-center md:justify-between"
                >

                  <div>

                    <p className="font-bold">
                      Screening #{screenings.length - index}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatTanggal(item.created_at)}
                    </p>

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="text-right">

                      <p className="text-xs font-bold text-slate-600">
                        SKOR
                      </p>

                      <p className="text-xl font-black text-cyan-400">
                        {item.skor}
                      </p>

                    </div>

                    <span
                      className={`rounded-xl border px-4 py-2 text-xs font-black ${statusClass(
                        item.hasil
                      )}`}
                    >
                      {item.hasil}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ======================================
            FOOTER
        ====================================== */}

        <p className="mt-8 text-center text-xs text-slate-600">
          AERIS — Sistem screening dan mitigasi risiko
          lingkungan sekolah.
        </p>

      </div>

    </main>
  );
}