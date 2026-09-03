"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Screening = {
  id: string;
  user_id: string;
  skor: number;
  hasil: string;
  created_at: string;
  users:
    | {
        id: string;
        nama: string;
        jenis_pengguna: string;
        kelas: string | null;
      }
    | {
        id: string;
        nama: string;
        jenis_pengguna: string;
        kelas: string | null;
      }[]
    | null;
};

export default function KepsekDashboard() {
  const router = useRouter();

  const [data, setData] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("aeris_role");

    if (role !== "kepsek") {
      router.replace("/login");
      return;
    }

    loadData();
  }, [router]);

  async function loadData() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("screenings")
      .select(`
        id,
        user_id,
        skor,
        hasil,
        created_at,
        users (
          id,
          nama,
          jenis_pengguna,
          kelas
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setData((data || []) as Screening[]);
    setLoading(false);
  }

  function getUser(item: Screening) {
    if (Array.isArray(item.users)) {
      return item.users[0] || null;
    }

    return item.users;
  }

  function getCategory(hasil: string) {
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

  const statistik = useMemo(() => {
    let normal = 0;
    let waspada = 0;
    let siaga = 0;

    data.forEach((item) => {
      const category = getCategory(item.hasil);

      if (category === "normal") normal++;
      else if (category === "waspada") waspada++;
      else siaga++;
    });

    return {
      total: data.length,
      normal,
      waspada,
      siaga,
    };
  }, [data]);

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

    data.forEach((item) => {
      const user = getUser(item);
      const kelas = user?.kelas || "Tidak diketahui";

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

      if (category === "normal") result[kelas].normal++;
      else if (category === "waspada") result[kelas].waspada++;
      else result[kelas].siaga++;
    });

    return Object.entries(result)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10);
  }, [data]);

  const persentaseNormal =
    statistik.total > 0
      ? Math.round((statistik.normal / statistik.total) * 100)
      : 0;

  const persentaseWaspada =
    statistik.total > 0
      ? Math.round((statistik.waspada / statistik.total) * 100)
      : 0;

  const persentaseSiaga =
    statistik.total > 0
      ? Math.round((statistik.siaga / statistik.total) * 100)
      : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-cyan-400 font-black tracking-[0.35em]">
            AERIS
          </p>

          <div className="mt-5 h-8 w-8 mx-auto rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />

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
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between gap-4">

          <div>
            <p className="text-cyan-400 font-black tracking-[0.3em] text-sm">
              AERIS
            </p>

            <h1 className="mt-1 text-xl sm:text-2xl font-black">
              Dashboard Kepala Sekolah
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Monitoring kondisi risiko kesehatan warga sekolah
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("aeris_role");
              localStorage.removeItem("aeris_username");
              localStorage.removeItem("aeris_nama");

              router.replace("/login");
            }}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800 transition"
          >
            Keluar
          </button>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* TITLE */}
        <section className="mb-8">
          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-slate-900 p-6 sm:p-8">

            <p className="text-cyan-400 text-sm font-bold tracking-widest uppercase">
              Executive Overview
            </p>

            <h2 className="mt-2 text-2xl sm:text-4xl font-black">
              Kondisi Risiko Sekolah
            </h2>

            <p className="mt-3 text-slate-400 max-w-2xl">
              Ringkasan hasil skrining warga sekolah berdasarkan
              data yang tercatat pada sistem AERIS.
            </p>

          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="font-bold text-red-400">
              Gagal mengambil data
            </p>

            <p className="mt-1 text-sm text-red-300">
              {error}
            </p>

            <button
              onClick={loadData}
              className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* STATISTIK UTAMA */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Skrining"
            value={statistik.total}
            description="Seluruh data"
            icon="◎"
          />

          <StatCard
            title="Normal"
            value={statistik.normal}
            description={`${persentaseNormal}% dari total`}
            icon="✓"
            type="normal"
          />

          <StatCard
            title="Waspada"
            value={statistik.waspada}
            description={`${persentaseWaspada}% dari total`}
            icon="!"
            type="waspada"
          />

          <StatCard
            title="Siaga"
            value={statistik.siaga}
            description={`${persentaseSiaga}% dari total`}
            icon="⚠"
            type="siaga"
          />

        </section>

        {/* RINGKASAN */}
        <section className="mt-6 grid lg:grid-cols-3 gap-5">

          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black">
                  Distribusi Risiko
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Gambaran hasil skrining sekolah
                </p>
              </div>
            </div>

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

          </div>

          {/* STATUS */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="text-lg font-black">
              Status Sistem
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Kondisi pemantauan AERIS
            </p>

            <div className="mt-7 flex items-center gap-4">

              <div className="h-12 w-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              <div>
                <p className="font-bold text-cyan-400">
                  SISTEM AKTIF
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Database terhubung
                </p>
              </div>

            </div>

            <div className="mt-7 pt-5 border-t border-slate-800">

              <p className="text-xs uppercase tracking-widest text-slate-500">
                Data Terakhir
              </p>

              <p className="mt-2 font-bold">
                {data.length > 0
                  ? new Date(data[0].created_at).toLocaleString(
                      "id-ID",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )
                  : "Belum ada data"}
              </p>

            </div>

          </div>

        </section>

        {/* PER KELAS */}
        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <h3 className="text-lg font-black">
              Ringkasan Berdasarkan Kelas
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Maksimal 10 kelas dengan jumlah skrining terbanyak
            </p>

          </div>

          {kelasData.length === 0 ? (

            <div className="p-10 text-center text-slate-500">
              Belum ada data skrining.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-800">
                    <th className="px-6 py-4 font-bold">
                      Kelas
                    </th>

                    <th className="px-6 py-4 font-bold">
                      Total
                    </th>

                    <th className="px-6 py-4 font-bold text-emerald-400">
                      Normal
                    </th>

                    <th className="px-6 py-4 font-bold text-yellow-400">
                      Waspada
                    </th>

                    <th className="px-6 py-4 font-bold text-red-400">
                      Siaga
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {kelasData.map(([kelas, item]) => (
                    <tr
                      key={kelas}
                      className="border-b border-slate-800/70 hover:bg-slate-800/40"
                    >

                      <td className="px-6 py-4 font-black">
                        {kelas}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
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
                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* DATA TERBARU */}
        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

          <div className="p-6 border-b border-slate-800 flex items-center justify-between">

            <div>
              <h3 className="text-lg font-black">
                Skrining Terbaru
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Lima data skrining terakhir
              </p>
            </div>

            <button
              onClick={loadData}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold hover:bg-slate-800 transition"
            >
              ↻ Refresh
            </button>

          </div>

          <div className="divide-y divide-slate-800">

            {data.slice(0, 5).map((item) => {

              const user = getUser(item);
              const category = getCategory(item.hasil);

              return (
                <div
                  key={item.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >

                  <div>

                    <p className="font-bold">
                      {user?.nama || "Pengguna"}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {user?.kelas || "Tanpa kelas"} •{" "}
                      {user?.jenis_pengguna || "Warga sekolah"}
                    </p>

                  </div>

                  <div className="flex items-center gap-5">

                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        Skor
                      </p>

                      <p className="font-black text-lg">
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
            })}

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

          <p className="text-slate-700 text-xs mt-1">
            Sistem mitigasi risiko kesehatan warga sekolah
          </p>

        </footer>

      </div>

    </main>
  );
}


/* =========================
   KOMPONEN STAT CARD
========================= */

function StatCard({
  title,
  value,
  description,
  icon,
  type,
}: {
  title: string;
  value: number;
  description: string;
  icon: string;
  type?: "normal" | "waspada" | "siaga";
}) {

  const iconStyle = {
    normal:
      "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
    waspada:
      "bg-yellow-400/10 border-yellow-400/20 text-yellow-400",
    siaga:
      "bg-red-400/10 border-red-400/20 text-red-400",
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">
            {title}
          </p>

          <p className="mt-2 text-3xl sm:text-4xl font-black">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {description}
          </p>
        </div>

        <div
          className={`h-10 w-10 rounded-xl border flex items-center justify-center font-black ${
            type
              ? iconStyle[type]
              : "bg-cyan-400/10 border-cyan-400/20 text-cyan-400"
          }`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


/* =========================
   RISK BAR
========================= */

function RiskBar({
  label,
  value,
  total,
  type,
}: {
  label: string;
  value: number;
  total: number;
  type: "normal" | "waspada" | "siaga";
}) {

  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  const barStyle = {
    normal: "bg-emerald-400",
    waspada: "bg-yellow-400",
    siaga: "bg-red-400",
  };

  const textStyle = {
    normal: "text-emerald-400",
    waspada: "text-yellow-400",
    siaga: "text-red-400",
  };

  return (
    <div className="mb-6 last:mb-0">

      <div className="flex justify-between mb-2">

        <span className="text-sm font-bold">
          {label}
        </span>

        <span className={`text-sm font-black ${textStyle[type]}`}>
          {value} ({percentage}%)
        </span>

      </div>

      <div className="h-3 rounded-full bg-slate-800 overflow-hidden">

        <div
          className={`h-full rounded-full ${barStyle[type]} transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>
  );
}


/* =========================
   RISK BADGE
========================= */

function RiskBadge({
  category,
  hasil,
}: {
  category: "normal" | "waspada" | "siaga";
  hasil: string;
}) {

  const style = {
    normal:
      "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
    waspada:
      "bg-yellow-400/10 border-yellow-400/20 text-yellow-400",
    siaga:
      "bg-red-400/10 border-red-400/20 text-red-400",
  };

  return (
    <span
      className={`rounded-xl border px-3 py-2 text-xs font-black ${style[category]}`}
    >
      {hasil}
    </span>
  );
}