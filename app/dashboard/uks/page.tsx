"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

// ============================================
// TIPE DATA
// ============================================

type UserData = {
  id: string;
  nama: string;
  jenis_pengguna: string;
  kelas: string;
};

type ScreeningData = {
  id: string;
  user_id: string;
  skor: number;
  hasil: string;
  created_at: string;
  user?: UserData;
};

// ============================================
// DASHBOARD UKS
// ============================================

export default function UKSDashboard() {
  const router = useRouter();

  const [screenings, setScreenings] = useState<ScreeningData[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterHasil, setFilterHasil] = useState("Semua");

  // ============================================
  // LOAD DATA
  // ============================================

  useEffect(() => {
    async function loadData() {
      const role = localStorage.getItem("aeris_role");

      if (role !== "uks") {
        router.push("/login");
        return;
      }

      try {
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
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error("SUPABASE ERROR:", error);
          alert(error.message);
          return;
        }

        const formattedData = (data ?? []).map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          skor: item.skor,
          hasil: item.hasil,
          created_at: item.created_at,
          user: Array.isArray(item.users)
            ? item.users[0]
            : item.users,
        }));

        setScreenings(formattedData);
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
    localStorage.removeItem("aeris_role");
    localStorage.removeItem("aeris_username");
    localStorage.removeItem("aeris_nama");
    localStorage.removeItem("aeris_user");

    router.push("/login");
  }

  // ============================================
  // FILTER DATA
  // ============================================

  const filteredScreenings = useMemo(() => {
    return screenings.filter((item) => {
      const nama =
        item.user?.nama?.toLowerCase() ?? "";

      const searchMatch = nama.includes(
        search.toLowerCase()
      );

      const jenisMatch =
        filterJenis === "Semua" ||
        item.user?.jenis_pengguna === filterJenis;

      const hasilMatch =
        filterHasil === "Semua" ||
        item.hasil === filterHasil;

      return (
        searchMatch &&
        jenisMatch &&
        hasilMatch
      );
    });
  }, [
    screenings,
    search,
    filterJenis,
    filterHasil,
  ]);

  // ============================================
  // STATISTIK
  // ============================================

  const totalScreening = screenings.length;

  const normal = screenings.filter((item) =>
    item.hasil.toLowerCase().includes("rendah") ||
    item.hasil.toLowerCase().includes("normal")
  ).length;

  const waspada = screenings.filter((item) =>
    item.hasil.toLowerCase().includes("perhatian") ||
    item.hasil.toLowerCase().includes("waspada")
  ).length;

  const siaga = screenings.filter((item) => {
    const hasil = item.hasil.toLowerCase();

    return (
      hasil.includes("evaluasi") ||
      hasil.includes("prioritas") ||
      hasil.includes("siaga")
    );
  }).length;

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
  // STATUS STYLE
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
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <p className="text-cyan-400 font-bold tracking-[0.3em] text-sm">
            AERIS
          </p>

          <p className="mt-4 text-slate-400">
            Memuat dashboard UKS...
          </p>

        </div>

      </main>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">

      <div className="mx-auto w-full max-w-7xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-cyan-400 font-bold tracking-[0.3em] text-sm">
              AERIS
            </p>

            <h1 className="mt-2 text-3xl md:text-4xl font-black">
              Dashboard PIC UKS
            </h1>

            <p className="mt-2 text-slate-400">
              Monitoring hasil screening warga sekolah.
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
            STATISTIK
        ====================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">

          {/* TOTAL */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm font-bold text-slate-500">
              TOTAL SCREENING
            </p>

            <p className="mt-3 text-4xl font-black text-cyan-400">
              {totalScreening}
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Seluruh data screening
            </p>

          </div>

          {/* NORMAL */}

          <div className="rounded-3xl border border-green-500/20 bg-slate-900 p-6">

            <p className="text-sm font-bold text-slate-500">
              RISIKO RENDAH
            </p>

            <p className="mt-3 text-4xl font-black text-green-400">
              {normal}
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Perlu pemantauan rutin
            </p>

          </div>

          {/* WASPADA */}

          <div className="rounded-3xl border border-yellow-500/20 bg-slate-900 p-6">

            <p className="text-sm font-bold text-slate-500">
              PERHATIAN
            </p>

            <p className="mt-3 text-4xl font-black text-yellow-400">
              {waspada}
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Perlu perhatian lebih
            </p>

          </div>

          {/* SIAGA */}

          <div className="rounded-3xl border border-red-500/20 bg-slate-900 p-6">

            <p className="text-sm font-bold text-slate-500">
              PRIORITAS
            </p>

            <p className="mt-3 text-4xl font-black text-red-400">
              {siaga}
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Perlu tindak lanjut
            </p>

          </div>

        </section>

        {/* ======================================
            FILTER
        ====================================== */}

        <section className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-5">

            <p className="text-sm font-bold text-cyan-400 tracking-wider">
              FILTER DATA
            </p>

            <h2 className="mt-2 text-xl font-black">
              Cari Screening
            </h2>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {/* SEARCH */}

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari nama..."
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white placeholder:text-slate-600 outline-none transition focus:border-cyan-400"
            />

            {/* JENIS */}

            <select
              value={filterJenis}
              onChange={(e) =>
                setFilterJenis(e.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
            >

              <option value="Semua">
                Semua jenis pengguna
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

            {/* HASIL */}

            <select
              value={filterHasil}
              onChange={(e) =>
                setFilterHasil(e.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
            >

              <option value="Semua">
                Semua hasil
              </option>

              <option value="Indeks Risiko Rendah">
                Risiko Rendah
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

        </section>

        {/* ======================================
            TABEL DATA
        ====================================== */}

        <section className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">

          <div className="p-6 md:p-8 border-b border-slate-800">

            <p className="text-sm font-bold text-cyan-400 tracking-wider">
              DATABASE SCREENING
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Data Warga Sekolah
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Menampilkan {filteredScreenings.length}{" "}
              data.
            </p>

          </div>

          {/* TABLE DESKTOP */}

          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-950">

                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                  <th className="px-6 py-4">
                    Nama
                  </th>

                  <th className="px-6 py-4">
                    Jenis
                  </th>

                  <th className="px-6 py-4">
                    Kelas / Detail
                  </th>

                  <th className="px-6 py-4">
                    Skor
                  </th>

                  <th className="px-6 py-4">
                    Hasil
                  </th>

                  <th className="px-6 py-4">
                    Tanggal
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredScreenings.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t border-slate-800 transition hover:bg-slate-800/40"
                  >

                    <td className="px-6 py-5">

                      <p className="font-bold">
                        {item.user?.nama ?? "Tidak diketahui"}
                      </p>

                    </td>

                    <td className="px-6 py-5 text-sm text-slate-400">
                      {item.user?.jenis_pengguna ?? "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-400">
                      {item.user?.kelas ?? "-"}
                    </td>

                    <td className="px-6 py-5">

                      <span className="font-black text-cyan-400">
                        {item.skor}
                      </span>

                      <span className="text-xs text-slate-600">
                        {" "}/ 60
                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex rounded-xl border px-3 py-2 text-xs font-black ${statusClass(
                          item.hasil
                        )}`}
                      >
                        {item.hasil}
                      </span>

                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {formatTanggal(item.created_at)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* MOBILE */}

          <div className="md:hidden p-4 space-y-3">

            {filteredScreenings.map((item) => (

              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="font-black">
                      {item.user?.nama ?? "Tidak diketahui"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.user?.jenis_pengguna ?? "-"}
                    </p>

                  </div>

                  <span className="text-2xl font-black text-cyan-400">
                    {item.skor}
                  </span>

                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">

                  <span className="rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-500">
                    {item.user?.kelas ?? "-"}
                  </span>

                  <span
                    className={`rounded-lg border px-3 py-2 text-xs font-bold ${statusClass(
                      item.hasil
                    )}`}
                  >
                    {item.hasil}
                  </span>

                </div>

                <p className="mt-3 text-xs text-slate-600">
                  {formatTanggal(item.created_at)}
                </p>

              </div>

            ))}

          </div>

          {/* EMPTY */}

          {filteredScreenings.length === 0 && (

            <div className="p-12 text-center">

              <p className="text-slate-500">
                Tidak ada data yang sesuai.
              </p>

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