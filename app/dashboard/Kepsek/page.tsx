"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Screening = {
  id: string;
  user_id: string;
  skor: number;
  hasil: string;
  created_at: string;
};

type User = {
  id: string;
  nama: string;
  no_hp: string | null;
  jenis_pengguna: string | null;
  kelas: string | null;
};

type ScreeningData = Screening & {
  user: User | null;
};

type Category = "normal" | "waspada" | "siaga";

export default function KepsekDashboard() {
  const router = useRouter();

  const [data, setData] = useState<ScreeningData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [namaKepsek, setNamaKepsek] = useState("Kepala Sekolah");
  const [noHpKepsek, setNoHpKepsek] = useState("-");

  useEffect(() => {
    const role = localStorage.getItem("aeris_role");

    if (role !== "kepsek") {
      router.replace("/login");
      return;
    }

    setNamaKepsek(
      localStorage.getItem("aeris_nama") || "Kepala Sekolah"
    );

    setNoHpKepsek(
      localStorage.getItem("aeris_no_hp") || "-"
    );

    loadData();
  }, [router]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      // ===============================
      // AMBIL SCREENINGS
      // ===============================

      const {
        data: screenings,
        error: screeningError,
      } = await supabase
        .from("screenings")
        .select("id, user_id, skor, hasil, created_at")
        .order("created_at", {
          ascending: false,
        });

      if (screeningError) {
        throw new Error(screeningError.message);
      }

      if (!screenings || screenings.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      // ===============================
      // AMBIL USER
      // ===============================

      const userIds = Array.from(
        new Set(
          screenings.map(
            (screening: Screening) => screening.user_id
          )
        )
      );

      const {
        data: users,
        error: usersError,
      } = await supabase
        .from("users")
        .select(
          "id, nama, no_hp, jenis_pengguna, kelas"
        )
        .in("id", userIds);

      if (usersError) {
        throw new Error(usersError.message);
      }

      // ===============================
      // GABUNG DATA
      // ===============================

      const userMap = new Map<string, User>();

      (users || []).forEach((user: User) => {
        userMap.set(user.id, user);
      });

      const merged: ScreeningData[] =
        screenings.map((screening: Screening) => ({
          ...screening,
          user: userMap.get(screening.user_id) || null,
        }));

      setData(merged);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data."
      );
    }

    setLoading(false);
  }

  // ===============================
  // KATEGORI
  // ===============================

  function getCategory(hasil: string): Category {
    const value = hasil.toLowerCase();

    if (
      value.includes("rendah") ||
      value.includes("normal")
    ) {
      return "normal";
    }

    if (
      value.includes("perhatian") ||
      value.includes("waspada")
    ) {
      return "waspada";
    }

    return "siaga";
  }

  // ===============================
  // STATISTIK
  // ===============================

  const statistik = useMemo(() => {
    let normal = 0;
    let waspada = 0;
    let siaga = 0;

    data.forEach((item: ScreeningData) => {
      const category = getCategory(item.hasil);

      if (category === "normal") {
        normal++;
      } else if (category === "waspada") {
        waspada++;
      } else {
        siaga++;
      }
    });

    return {
      total: data.length,
      normal,
      waspada,
      siaga,
    };
  }, [data]);

  // ===============================
  // DATA PER KELAS
  // ===============================

  const kelasData = useMemo(() => {
    const result: Record<
      string,
      {
        total: number;
        normal: number;
        waspada: number;
        siaga: number;
      }
    > = {};

    data.forEach((item: ScreeningData) => {
      const kelas = item.user?.kelas || "Tidak diketahui";

      if (!result[kelas]) {
        result[kelas] = {
          total: 0,
          normal: 0,
          waspada: 0,
          siaga: 0,
        };
      }

      result[kelas].total++;

      const category = getCategory(item.hasil);

      if (category === "normal") {
        result[kelas].normal++;
      } else if (category === "waspada") {
        result[kelas].waspada++;
      } else {
        result[kelas].siaga++;
      }
    });

    return Object.entries(result).sort(
      (a, b) => b[1].total - a[1].total
    );
  }, [data]);

  // ===============================
  // LOGOUT
  // ===============================

  function logout() {
    localStorage.removeItem("aeris_role");
    localStorage.removeItem("aeris_username");
    localStorage.removeItem("aeris_nama");
    localStorage.removeItem("aeris_no_hp");

    router.replace("/login");
  }

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">

          <p className="text-cyan-400 font-black tracking-[0.3em]">
            AERIS
          </p>

          <div className="mt-5 mx-auto h-9 w-9 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />

          <p className="mt-4 text-slate-400">
            Memuat dashboard...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">

          <div>
            <p className="text-cyan-400 font-black tracking-[0.3em] text-sm">
              AERIS
            </p>

            <h1 className="text-xl sm:text-2xl font-black mt-1">
              Dashboard Kepala Sekolah
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Monitoring risiko kesehatan warga sekolah
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold hover:bg-slate-800"
          >
            Keluar
          </button>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* PROFIL KEPSEK */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                Akun Kepala Sekolah
              </p>

              <h2 className="text-2xl font-black mt-2">
                {namaKepsek}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Kepala Sekolah
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4">

              <p className="text-xs text-slate-500">
                Nomor Telepon
              </p>

              <p className="text-lg font-black text-cyan-400 mt-1">
                {noHpKepsek}
              </p>

            </div>

          </div>

        </section>

        {/* ERROR */}
        {error && (
          <section className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-5">

            <p className="font-black text-red-400">
              Gagal mengambil data
            </p>

            <p className="text-sm text-red-300 mt-2 break-words">
              {error}
            </p>

            <button
              onClick={loadData}
              className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold"
            >
              Coba Lagi
            </button>

          </section>
        )}

        {/* EXECUTIVE OVERVIEW */}
        <section className="mt-6 rounded-3xl border border-cyan-500/20 bg-cyan-400/5 p-6 sm:p-8">

          <p className="text-cyan-400 text-sm font-black tracking-widest">
            EXECUTIVE OVERVIEW
          </p>

          <h2 className="text-2xl sm:text-4xl font-black mt-2">
            Kondisi Risiko Sekolah
          </h2>

          <p className="text-slate-400 mt-3 max-w-2xl">
            Ringkasan hasil skrining warga sekolah
            yang tercatat dalam sistem AERIS.
          </p>

        </section>

        {/* STATISTIK */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

          <StatCard
            title="Total Skrining"
            value={statistik.total}
            type="total"
          />

          <StatCard
            title="Normal"
            value={statistik.normal}
            type="normal"
          />

          <StatCard
            title="Waspada"
            value={statistik.waspada}
            type="waspada"
          />

          <StatCard
            title="Siaga"
            value={statistik.siaga}
            type="siaga"
          />

        </section>

        {/* DISTRIBUSI */}
        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="text-xl font-black">
            Distribusi Risiko
          </h3>

          <p className="text-sm text-slate-500 mt-1 mb-7">
            Persentase hasil skrining sekolah
          </p>

          <RiskBar
            label="Normal"
            value={statistik.normal}
            total={statistik.total}
            type="normal"
          />

          <RiskBar
            label="Waspada"
            value={statistik.waspada}
            total={statistik.total}
            type="waspada"
          />

          <RiskBar
            label="Siaga"
            value={statistik.siaga}
            total={statistik.total}
            type="siaga"
          />

        </section>

        {/* PER KELAS */}
        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <h3 className="text-xl font-black">
              Ringkasan Berdasarkan Kelas
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Rekap hasil skrining setiap kelas
            </p>

          </div>

          {kelasData.length === 0 ? (

            <div className="p-10 text-center text-slate-500">
              Belum ada data skrining.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px]">

                <thead>
                  <tr className="border-b border-slate-800 text-left">

                    <th className="px-6 py-4 text-slate-500">
                      Kelas
                    </th>

                    <th className="px-6 py-4 text-slate-500">
                      Total
                    </th>

                    <th className="px-6 py-4 text-emerald-400">
                      Normal
                    </th>

                    <th className="px-6 py-4 text-yellow-400">
                      Waspada
                    </th>

                    <th className="px-6 py-4 text-red-400">
                      Siaga
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {kelasData.map(
                    ([kelas, item]) => (
                      <tr
                        key={kelas}
                        className="border-b border-slate-800/70"
                      >

                        <td className="px-6 py-4 font-black">
                          {kelas}
                        </td>

                        <td className="px-6 py-4">
                          {item.total}
                        </td>

                        <td className="px-6 py-4 text-emerald-400 font-bold">
                          {item.normal}
                        </td>

                        <td className="px-6 py-4 text-yellow-400 font-bold">
                          {item.waspada}
                        </td>

                        <td className="px-6 py-4 text-red-400 font-bold">
                          {item.siaga}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* SKRINING TERBARU */}
        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

          <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4">

            <div>

              <h3 className="text-xl font-black">
                Skrining Terbaru
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Lima data skrining terakhir
              </p>

            </div>

            <button
              onClick={loadData}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold hover:bg-slate-800"
            >
              ↻ Refresh
            </button>

          </div>

          <div className="divide-y divide-slate-800">

            {data.slice(0, 5).map(
              (item: ScreeningData) => {

                const category = getCategory(
                  item.hasil
                );

                return (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >

                    <div>

                      <p className="font-black">
                        {item.user?.nama || "Pengguna"}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {item.user?.kelas || "Tanpa kelas"}
                        {" • "}
                        {item.user?.jenis_pengguna ||
                          "Warga sekolah"}
                      </p>

                      <p className="text-xs text-slate-600 mt-1">
                        {new Date(
                          item.created_at
                        ).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>

                    </div>

                    <div className="flex items-center gap-5">

                      <div className="text-right">

                        <p className="text-xs text-slate-500">
                          Skor
                        </p>

                        <p className="text-2xl font-black">
                          {item.skor}
                        </p>

                      </div>

                      <RiskBadge
                        category={category}
                        hasil={item.hasil}
                      />

                    </div>

                  </div>
                );
              }
            )}

            {data.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                Belum ada data skrining.
              </div>
            )}

          </div>

        </section>

        {/* FOOTER */}
        <footer className="py-10 text-center">

          <p className="text-cyan-400 font-black tracking-[0.3em] text-xs">
            AERIS
          </p>

          <p className="text-slate-600 text-xs mt-2">
            Air Exposure Risk & Infection Screening System
          </p>

        </footer>

      </div>
    </main>
  );
}


/* ==========================================
   STAT CARD
========================================== */

function StatCard({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type: Category | "total";
}) {
  const styles = {
    total:
      "text-cyan-400 border-cyan-400/20 bg-cyan-400/10",

    normal:
      "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",

    waspada:
      "text-yellow-400 border-yellow-400/20 bg-yellow-400/10",

    siaga:
      "text-red-400 border-red-400/20 bg-red-400/10",
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

      <div
        className={`h-10 w-10 rounded-xl border flex items-center justify-center font-black ${styles[type]}`}
      >
        {type === "total"
          ? "◎"
          : type === "normal"
          ? "✓"
          : type === "waspada"
          ? "!"
          : "⚠"}
      </div>

      <p className="text-xs sm:text-sm text-slate-500 font-bold mt-5">
        {title}
      </p>

      <p className="text-3xl sm:text-4xl font-black mt-1">
        {value}
      </p>

    </div>
  );
}


/* ==========================================
   RISK BAR
========================================== */

function RiskBar({
  label,
  value,
  total,
  type,
}: {
  label: string;
  value: number;
  total: number;
  type: Category;
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  const barStyles = {
    normal: "bg-emerald-400",
    waspada: "bg-yellow-400",
    siaga: "bg-red-400",
  };

  const textStyles = {
    normal: "text-emerald-400",
    waspada: "text-yellow-400",
    siaga: "text-red-400",
  };

  return (
    <div className="mb-6">

      <div className="flex justify-between mb-2">

        <span className="text-sm font-bold">
          {label}
        </span>

        <span
          className={`text-sm font-black ${textStyles[type]}`}
        >
          {value} ({percentage}%)
        </span>

      </div>

      <div className="h-3 rounded-full bg-slate-800 overflow-hidden">

        <div
          className={`h-full rounded-full ${barStyles[type]}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}


/* ==========================================
   RISK BADGE
========================================== */

function RiskBadge({
  category,
  hasil,
}: {
  category: Category;
  hasil: string;
}) {
  const styles = {
    normal:
      "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",

    waspada:
      "bg-yellow-400/10 border-yellow-400/20 text-yellow-400",

    siaga:
      "bg-red-400/10 border-red-400/20 text-red-400",
  };

  return (
    <span
      className={`rounded-xl border px-3 py-2 text-xs font-black ${styles[category]}`}
    >
      {hasil}
    </span>
  );
}