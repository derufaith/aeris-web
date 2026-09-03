"use client";

import { useEffect, useState } from "react";
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

type DataScreening = Screening & {
  user?: User;
};

export default function PuskesmasPage() {
  const [data, setData] = useState<DataScreening[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");

  useEffect(() => {
    const role = localStorage.getItem("aeris_role");

    if (role !== "puskesmas") {
      window.location.href = "/login";
      return;
    }

    ambilData();
  }, []);

  async function ambilData() {
    setLoading(true);

    const { data: screenings, error } = await supabase
      .from("screenings")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      alert("Gagal mengambil data screening.");
      setLoading(false);
      return;
    }

    const screeningData = (screenings || []) as Screening[];

    const userIds = [
      ...new Set(
        screeningData
          .map((item) => item.user_id)
          .filter(Boolean)
      ),
    ];

    let users: User[] = [];

    if (userIds.length > 0) {
      const { data: userData, error: userError } =
        await supabase
          .from("users")
          .select(
            "id, nama, no_hp, jenis_pengguna, kelas"
          )
          .in("id", userIds);

      if (userError) {
        console.error(userError);
      } else {
        users = (userData || []) as User[];
      }
    }

    const userMap = new Map<string, User>();

    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    const hasil: DataScreening[] = screeningData.map(
      (screening) => ({
        ...screening,
        user: userMap.get(screening.user_id),
      })
    );

    setData(hasil);
    setLoading(false);
  }

  function kategori(skor: number, hasil: string) {
    const text = hasil.toLowerCase();

    if (
      skor >= 25 ||
      text.includes("siaga") ||
      text.includes("prioritas")
    ) {
      return "siaga";
    }

    if (
      skor >= 13 ||
      text.includes("waspada") ||
      text.includes("perhatian")
    ) {
      return "waspada";
    }

    return "normal";
  }

  function namaKategori(
    skor: number,
    hasil: string
  ) {
    const k = kategori(skor, hasil);

    if (k === "siaga") {
      return "Prioritas Tindak Lanjut";
    }

    if (k === "waspada") {
      return "Perlu Perhatian";
    }

    return "Risiko Rendah";
  }

  function warnaKategori(
    skor: number,
    hasil: string
  ) {
    const k = kategori(skor, hasil);

    if (k === "siaga") {
      return "border-red-500/30 bg-red-500/10 text-red-400";
    }

    if (k === "waspada") {
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    }

    return "border-green-500/30 bg-green-500/10 text-green-400";
  }

  const normal = data.filter(
    (item) => kategori(item.skor, item.hasil) === "normal"
  ).length;

  const waspada = data.filter(
    (item) => kategori(item.skor, item.hasil) === "waspada"
  ).length;

  const siaga = data.filter(
    (item) => kategori(item.skor, item.hasil) === "siaga"
  ).length;

  const filteredData = data.filter((item) => {
    const nama = item.user?.nama || "";

    const cocokNama = nama
      .toLowerCase()
      .includes(search.toLowerCase());

    const cocokFilter =
      filter === "semua" ||
      kategori(item.skor, item.hasil) === filter;

    return cocokNama && cocokFilter;
  });

  const persentase = (jumlah: number) => {
    if (data.length === 0) return 0;

    return Math.round((jumlah / data.length) * 100);
  };

  function formatTanggal(tanggal: string) {
    return new Date(tanggal).toLocaleString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function exportCSV() {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const header = [
      "Nama",
      "Nomor HP",
      "Jenis Pengguna",
      "Kelas",
      "Skor",
      "Kategori",
      "Tanggal Screening",
    ];

    const rows = filteredData.map((item) => [
      item.user?.nama || "-",
      item.user?.no_hp || "-",
      item.user?.jenis_pengguna || "-",
      item.user?.kelas || "-",
      item.skor,
      namaKategori(item.skor, item.hasil),
      formatTanggal(item.created_at),
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${String(cell).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      ["\ufeff" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "AERIS_Data_Puskesmas.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  function logout() {
    localStorage.removeItem("aeris_role");
    localStorage.removeItem("aeris_username");
    localStorage.removeItem("aeris_nama");
    localStorage.removeItem("aeris_no_hp");

    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 font-black text-slate-950">
              A
            </div>

            <div>
              <h1 className="text-xl font-black">
                AERIS
              </h1>

              <p className="text-xs text-slate-400">
                Dashboard Puskesmas
              </p>
            </div>

          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800"
          >
            Keluar
          </button>

        </div>
      </header>


      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* TITLE */}

        <section className="mb-8">

          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-cyan-400">
            Monitoring Kesehatan Sekolah
          </p>

          <h2 className="text-3xl font-black md:text-4xl">
            Dashboard Puskesmas
          </h2>

          <p className="mt-3 max-w-3xl text-slate-400">
            Pusat pemantauan hasil skrining risiko
            TBC warga sekolah untuk membantu
            menentukan prioritas tindak lanjut.
          </p>

        </section>


        {/* STATISTIK */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Screening"
            value={data.length}
            icon="◉"
            description="Seluruh screening"
          />

          <StatCard
            title="Risiko Rendah"
            value={normal}
            icon="✓"
            description={`${persentase(normal)}% dari total`}
            type="normal"
          />

          <StatCard
            title="Perlu Perhatian"
            value={waspada}
            icon="!"
            description={`${persentase(waspada)}% dari total`}
            type="waspada"
          />

          <StatCard
            title="Prioritas"
            value={siaga}
            icon="!"
            description={`${persentase(siaga)}% dari total`}
            type="siaga"
          />

        </section>


        {/* DISTRIBUSI */}

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="text-xl font-black">
            Distribusi Risiko
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Gambaran hasil skrining seluruh warga sekolah.
          </p>


          <div className="mt-6 space-y-5">

            <ProgressBar
              label="Risiko Rendah"
              value={normal}
              total={data.length}
            />

            <ProgressBar
              label="Perlu Perhatian"
              value={waspada}
              total={data.length}
            />

            <ProgressBar
              label="Prioritas Tindak Lanjut"
              value={siaga}
              total={data.length}
            />

          </div>

        </section>


        {/* PRIORITAS */}

        <section className="mt-6 rounded-3xl border border-red-500/20 bg-slate-900 p-6">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h3 className="text-xl font-black">
                🚨 Prioritas Tindak Lanjut
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Data dengan tingkat risiko tertinggi.
              </p>
            </div>

            <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400">
              {siaga} data
            </span>

          </div>


          {siaga === 0 ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-500">
              Belum ada data prioritas tindak lanjut.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left text-sm">

                <thead className="border-b border-slate-800 text-slate-500">

                  <tr>
                    <th className="px-4 py-3">
                      Nama
                    </th>

                    <th className="px-4 py-3">
                      Kelas
                    </th>

                    <th className="px-4 py-3">
                      Skor
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {data
                    .filter(
                      (item) =>
                        kategori(
                          item.skor,
                          item.hasil
                        ) === "siaga"
                    )
                    .slice(0, 10)
                    .map((item) => (

                      <tr
                        key={item.id}
                        className="border-b border-slate-800/70"
                      >

                        <td className="px-4 py-4 font-bold">
                          {item.user?.nama || "-"}
                        </td>

                        <td className="px-4 py-4 text-slate-400">
                          {item.user?.kelas || "-"}
                        </td>

                        <td className="px-4 py-4 font-black text-red-400">
                          {item.skor}
                        </td>

                        <td className="px-4 py-4">

                          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${warnaKategori(
                            item.skor,
                            item.hasil
                          )}`}>
                            Prioritas
                          </span>

                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* DATA SCREENING */}

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h3 className="text-xl font-black">
                Seluruh Data Screening
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Data hasil skrining yang tersimpan di AERIS.
              </p>
            </div>


            <div className="flex gap-2">

              <button
                onClick={ambilData}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold hover:bg-slate-800"
              >
                ↻ Refresh
              </button>

              <button
                onClick={exportCSV}
                className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-300"
              >
                ↓ Export CSV
              </button>

            </div>

          </div>


          {/* FILTER */}

          <div className="grid gap-3 md:grid-cols-2">

            <input
              type="text"
              placeholder="Cari nama..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-400"
            />


            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-400"
            >

              <option value="semua">
                Semua Risiko
              </option>

              <option value="normal">
                Risiko Rendah
              </option>

              <option value="waspada">
                Perlu Perhatian
              </option>

              <option value="siaga">
                Prioritas
              </option>

            </select>

          </div>


          {/* TABLE */}

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800">

            {loading ? (

              <div className="p-10 text-center text-slate-400">
                Memuat data AERIS...
              </div>

            ) : filteredData.length === 0 ? (

              <div className="p-10 text-center text-slate-400">
                Tidak ada data ditemukan.
              </div>

            ) : (

              <table className="w-full min-w-[950px] text-left text-sm">

                <thead className="bg-slate-950 text-slate-500">

                  <tr>

                    <th className="px-4 py-4">
                      Nama
                    </th>

                    <th className="px-4 py-4">
                      Jenis
                    </th>

                    <th className="px-4 py-4">
                      Kelas
                    </th>

                    <th className="px-4 py-4">
                      No. HP
                    </th>

                    <th className="px-4 py-4">
                      Skor
                    </th>

                    <th className="px-4 py-4">
                      Status
                    </th>

                    <th className="px-4 py-4">
                      Waktu
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredData.map((item) => (

                    <tr
                      key={item.id}
                      className="border-t border-slate-800 hover:bg-slate-800/40"
                    >

                      <td className="px-4 py-4 font-bold">
                        {item.user?.nama || "-"}
                      </td>

                      <td className="px-4 py-4 text-slate-400">
                        {item.user?.jenis_pengguna || "-"}
                      </td>

                      <td className="px-4 py-4 text-slate-400">
                        {item.user?.kelas || "-"}
                      </td>

                      <td className="px-4 py-4 text-slate-400">
                        {item.user?.no_hp || "-"}
                      </td>

                      <td className="px-4 py-4 font-black">
                        {item.skor}
                      </td>

                      <td className="px-4 py-4">

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${warnaKategori(
                            item.skor,
                            item.hasil
                          )}`}
                        >
                          {namaKategori(
                            item.skor,
                            item.hasil
                          )}
                        </span>

                      </td>

                      <td className="px-4 py-4 text-slate-500">
                        {formatTanggal(
                          item.created_at
                        )}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>


          <p className="mt-4 text-sm text-slate-500">
            Menampilkan{" "}
            <span className="font-bold text-white">
              {filteredData.length}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-white">
              {data.length}
            </span>{" "}
            data.
          </p>

        </section>


        {/* CATATAN */}

        <section className="mt-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6">

          <h3 className="font-black text-cyan-400">
            ℹ️ Catatan Puskesmas
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            AERIS merupakan instrumen skrining risiko
            dan mitigasi lingkungan, bukan alat diagnosis
            TBC. Data dengan kategori prioritas digunakan
            sebagai dasar untuk menentukan kebutuhan
            tindak lanjut sesuai prosedur tenaga kesehatan.
          </p>

        </section>

      </div>

    </main>
  );
}


/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  description,
  icon,
  type = "default",
}: {
  title: string;
  value: number;
  description: string;
  icon: string;
  type?: "default" | "normal" | "waspada" | "siaga";
}) {
  const style = {
    default:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",

    normal:
      "border-green-400/20 bg-green-400/10 text-green-400",

    waspada:
      "border-yellow-400/20 bg-yellow-400/10 text-yellow-400",

    siaga:
      "border-red-400/20 bg-red-400/10 text-red-400",
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-semibold text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-4xl font-black">
            {value}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-xl font-black ${style[type]}`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-4 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* =========================
   PROGRESS BAR
========================= */

function ProgressBar({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round((value / total) * 100);

  return (
    <div>
      <p className="text-sm font-semibold text-slate-400">{label}</p>
      <div className="mb-2 flex items-center justify-between">
        <div className="h-2 w-full rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="ml-2 text-sm font-semibold text-slate-400">{percentage}%</span>
      </div>
    </div>
  );
}
