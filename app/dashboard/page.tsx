"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type User = {
  id: string;
  nama: string;
  no_hp: string;
  jenis_pengguna: string;
  kelas: string | null;
};

type Screening = {
  id: string;
  user_id: string;
  hasil: string | null;
  skor: number | null;
  indeks_gejala: number | null;
  kategori: string | null;
  catatan: string | null;
  created_at: string;
};

type ScreeningData = Screening & {
  user?: User;
};

export default function AkunPage() {
  // =========================
  // LOGIN
  // =========================

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // =========================
  // DASHBOARD
  // =========================

  const [data, setData] = useState<ScreeningData[]>([]);
  const [loading, setLoading] = useState(false);

  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua");

  // =========================
  // CEK LOGIN
  // =========================

  useEffect(() => {
    const status = localStorage.getItem("aeris_pic_login");

    if (status === "true") {
      setLoggedIn(true);
    }
  }, []);

  // =========================
  // LOGIN
  // =========================

  function login() {
    setLoginError("");

    if (username === "PIC" && password === "PIC") {
      localStorage.setItem("aeris_pic_login", "true");
      setLoggedIn(true);
      return;
    }

    setLoginError("Username atau password salah.");
  }

  // =========================
  // LOGOUT
  // =========================

  function logout() {
    localStorage.removeItem("aeris_pic_login");

    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setData([]);
  }

  // =========================
  // AMBIL DATA
  // =========================

  async function loadDashboard() {
    setLoading(true);

    try {
      // Ambil users
      const { data: users, error: usersError } =
        await supabase
          .from("users")
          .select(
            "id, nama, no_hp, jenis_pengguna, kelas"
          );

      if (usersError) {
        throw usersError;
      }

      // Ambil screening
      const { data: screenings, error: screeningError } =
        await supabase
          .from("screenings")
          .select(
            "id, user_id, hasil, skor, indeks_gejala, kategori, catatan, created_at"
          )
          .order("created_at", {
            ascending: false,
          });

      if (screeningError) {
        throw screeningError;
      }

      // Gabungkan screening dengan users
      const hasilGabungan: ScreeningData[] =
        (screenings || []).map((screening) => {
          const user = (users || []).find(
            (u) => u.id === screening.user_id
          );

          return {
            ...screening,
            user,
          };
        });

      setData(hasilGabungan);
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);

      alert(
        "Gagal mengambil data dari Supabase. Periksa RLS atau struktur tabel."
      );
    }

    setLoading(false);
  }

  // =========================
  // LOAD SAAT LOGIN
  // =========================

  useEffect(() => {
    if (loggedIn) {
      loadDashboard();
    }
  }, [loggedIn]);

  // =========================
  // DATA TERFILTER
  // =========================

  const dataFilter = useMemo(() => {
    return data.filter((item) => {
      const cocokJenis =
        filterJenis === "Semua" ||
        item.user?.jenis_pengguna === filterJenis;

      const cocokKategori =
        filterKategori === "Semua" ||
        item.kategori === filterKategori;

      return cocokJenis && cocokKategori;
    });
  }, [data, filterJenis, filterKategori]);

  // =========================
  // STATISTIK
  // =========================

  const totalScreening = data.length;

  const totalSiswa = data.filter(
    (item) =>
      item.user?.jenis_pengguna === "Siswa"
  ).length;

  const totalGuru = data.filter(
    (item) =>
      item.user?.jenis_pengguna === "Guru"
  ).length;

  const totalWarga = data.filter(
    (item) =>
      item.user?.jenis_pengguna ===
      "Warga Sekolah Lainnya"
  ).length;

  const totalRendah = data.filter(
    (item) =>
      item.kategori === "Indeks Gejala Rendah"
  ).length;

  const totalPerhatian = data.filter(
    (item) =>
      item.kategori === "Perlu Perhatian"
  ).length;

  const totalEvaluasi = data.filter(
    (item) =>
      item.kategori === "Perlu Evaluasi"
  ).length;

  const totalPrioritas = data.filter(
    (item) =>
      item.kategori ===
      "Prioritas Tindak Lanjut"
  ).length;

  // =========================
  // LOGIN PAGE
  // =========================

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

        <div className="w-full max-w-md">

          {/* HEADER */}

          <div className="text-center mb-8">

            <p className="text-cyan-400 font-bold tracking-[0.3em] text-sm">
              AERIS
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Akun PIC UKS
            </h1>

            <p className="mt-3 text-slate-400">
              Masuk untuk mengakses dashboard
              screening.
            </p>

          </div>

          {/* LOGIN CARD */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

            {/* USERNAME */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-bold text-slate-300">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Masukkan username"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-400"
              />

            </div>

            {/* PASSWORD */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-bold text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Masukkan password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    login();
                  }
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-400"
              />

            </div>

            {/* ERROR */}

            {loginError && (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {loginError}
              </div>
            )}

            {/* BUTTON */}

            <button
              onClick={login}
              className="w-full rounded-xl bg-cyan-400 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Masuk ke Dashboard →
            </button>

          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            AERIS • Dashboard PIC UKS
          </p>

        </div>

      </main>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-900">

        <div className="mx-auto max-w-7xl px-6 py-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-cyan-400 text-sm font-bold tracking-[0.3em]">
                AERIS
              </p>

              <h1 className="mt-1 text-2xl font-black">
                Dashboard PIC UKS
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Monitoring hasil screening warga sekolah
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={loadDashboard}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold hover:border-cyan-400"
              >
                ↻ Refresh
              </button>

              <button
                onClick={logout}
                className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/10"
              >
                Keluar
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* STATISTIK UTAMA */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Screening"
            value={totalScreening}
            description="Seluruh data"
          />

          <StatCard
            title="Siswa"
            value={totalSiswa}
            description="Peserta didik"
          />

          <StatCard
            title="Guru"
            value={totalGuru}
            description="Tenaga sekolah"
          />

          <StatCard
            title="Warga Sekolah"
            value={totalWarga}
            description="Karyawan / Kantin"
          />

        </div>

        {/* KATEGORI RISIKO */}

        <div className="mt-8">

          <h2 className="mb-4 text-xl font-black">
            Rekap Hasil Screening
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <RiskCard
              title="Indeks Gejala Rendah"
              value={totalRendah}
            />

            <RiskCard
              title="Perlu Perhatian"
              value={totalPerhatian}
            />

            <RiskCard
              title="Perlu Evaluasi"
              value={totalEvaluasi}
            />

            <RiskCard
              title="Prioritas Tindak Lanjut"
              value={totalPrioritas}
            />

          </div>

        </div>

        {/* FILTER */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <h2 className="mb-4 text-lg font-black">
            Filter Data
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">

            <select
              value={filterJenis}
              onChange={(e) =>
                setFilterJenis(e.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >

              <option value="Semua">
                Semua Jenis Pengguna
              </option>

              <option value="Siswa">
                Siswa
              </option>

              <option value="Guru">
                Guru
              </option>

              <option value="Warga Sekolah Lainnya">
                Warga Sekolah Lainnya
              </option>

            </select>

            <select
              value={filterKategori}
              onChange={(e) =>
                setFilterKategori(e.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >

              <option value="Semua">
                Semua Hasil
              </option>

              <option value="Indeks Gejala Rendah">
                Indeks Gejala Rendah
              </option>

              <option value="Perlu Perhatian">
                Perlu Perhatian
              </option>

              <option value="Perlu Evaluasi">
                Perlu Evaluasi
              </option>

              <option value="Prioritas Tindak Lanjut">
                Prioritas Tindak Lanjut
              </option>

            </select>

          </div>

        </div>

        {/* DATA SCREENING */}

        <div className="mt-8">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-xl font-black">
              Data Screening
            </h2>

            <span className="text-sm text-slate-500">
              {dataFilter.length} data
            </span>

          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">

            <table className="w-full min-w-[900px] text-left">

              <thead className="bg-slate-900">

                <tr className="border-b border-slate-800 text-sm text-slate-400">

                  <th className="px-5 py-4">
                    Nama
                  </th>

                  <th className="px-5 py-4">
                    Jenis
                  </th>

                  <th className="px-5 py-4">
                    Kelas / Kategori
                  </th>

                  <th className="px-5 py-4">
                    Skor
                  </th>

                  <th className="px-5 py-4">
                    Hasil
                  </th>

                  <th className="px-5 py-4">
                    Waktu
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      Memuat data...
                    </td>

                  </tr>

                ) : dataFilter.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      Belum ada data screening.
                    </td>

                  </tr>

                ) : (

                  dataFilter.map((item) => (

                    <tr
                      key={item.id}
                      className="border-b border-slate-800 bg-slate-950 hover:bg-slate-900"
                    >

                      <td className="px-5 py-4">

                        <p className="font-bold">
                          {item.user?.nama || "-"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {item.user?.no_hp || "-"}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <span className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-bold">
                          {item.user?.jenis_pengguna || "-"}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {item.user?.kelas || "-"}
                      </td>

                      <td className="px-5 py-4">

                        <span className="text-xl font-black text-cyan-400">
                          {item.skor ??
                            item.indeks_gejala ??
                            0}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-lg px-3 py-2 text-xs font-bold ${
                            item.kategori ===
                            "Indeks Gejala Rendah"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : item.kategori ===
                                "Perlu Perhatian"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : item.kategori ===
                                "Perlu Evaluasi"
                              ? "bg-orange-400/10 text-orange-400"
                              : "bg-red-400/10 text-red-400"
                          }`}
                        >
                          {item.kategori || "-"}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">

                        {new Date(
                          item.created_at
                        ).toLocaleString("id-ID")}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* FOOTER */}

        <p className="mt-8 text-center text-xs text-slate-600">
          AERIS • Sistem Monitoring Screening Warga Sekolah
        </p>

      </div>

    </main>
  );
}

// =====================================================
// COMPONENT STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-4xl font-black text-cyan-400">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>

    </div>
  );
}

// =====================================================
// COMPONENT RISK CARD
// =====================================================

function RiskCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-black">
        {value}
      </p>

    </div>
  );
}