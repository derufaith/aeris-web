"use client";

import { useState } from "react";

const classes = [
  {
    name: "X-A",
    total: 32,
    screened: 29,
    followUp: 2,
    status: "Perlu perhatian",
  },
  {
    name: "X-B",
    total: 31,
    screened: 31,
    followUp: 0,
    status: "Aman",
  },
  {
    name: "X-C",
    total: 30,
    screened: 26,
    followUp: 3,
    status: "Perlu perhatian",
  },
  {
    name: "XI-A",
    total: 32,
    screened: 30,
    followUp: 1,
    status: "Aman",
  },
  {
    name: "XI-B",
    total: 31,
    screened: 25,
    followUp: 4,
    status: "Perlu perhatian",
  },
];

export default function DashboardPage() {
  const [selectedClass, setSelectedClass] = useState("Semua Kelas");

  const totalStudents = classes.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const totalScreened = classes.reduce(
    (sum, item) => sum + item.screened,
    0
  );

  const totalFollowUp = classes.reduce(
    (sum, item) => sum + item.followUp,
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}

      <nav className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-xl font-bold tracking-widest text-cyan-400">
              AERIS
            </p>

            <p className="text-xs text-slate-500">
              School Health Intelligence
            </p>
          </div>

          <div className="flex items-center gap-3">

            <a
              href="/edukasi"
              className="rounded-xl px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Edukasi
            </a>

            <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2">
              <p className="text-sm font-semibold">
                Petugas UKS
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

          </div>

        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-bold tracking-[0.3em] text-cyan-400">
              DASHBOARD
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Monitoring Kesehatan Sekolah
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Pantau hasil screening kesehatan siswa berdasarkan
              kelas dan identifikasi siswa yang membutuhkan
              tindak lanjut.
            </p>

          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm outline-none"
          >
            <option>Semua Kelas</option>

            {classes.map((item) => (
              <option key={item.name}>
                {item.name}
              </option>
            ))}
          </select>

        </div>

        {/* STATISTICS */}

        <section className="mt-10 grid gap-5 md:grid-cols-4">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Total Siswa
            </p>

            <p className="mt-3 text-4xl font-bold">
              {totalStudents}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Sudah Screening
            </p>

            <p className="mt-3 text-4xl font-bold text-cyan-400">
              {totalScreened}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">
              Belum Screening
            </p>

            <p className="mt-3 text-4xl font-bold">
              {totalStudents - totalScreened}
            </p>
          </div>

          <div className="rounded-3xl border border-amber-500/20 bg-amber-950/20 p-6">
            <p className="text-sm text-amber-400">
              Perlu Tindak Lanjut
            </p>

            <p className="mt-3 text-4xl font-bold text-amber-400">
              {totalFollowUp}
            </p>
          </div>

        </section>

        {/* CLASS TABLE */}

        <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Monitoring Per Kelas
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Status screening siswa
              </p>
            </div>

          </div>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-slate-800 text-sm text-slate-500">

                <tr>
                  <th className="px-4 py-4">
                    Kelas
                  </th>

                  <th className="px-4 py-4">
                    Siswa
                  </th>

                  <th className="px-4 py-4">
                    Screening
                  </th>

                  <th className="px-4 py-4">
                    Belum
                  </th>

                  <th className="px-4 py-4">
                    Tindak Lanjut
                  </th>

                  <th className="px-4 py-4">
                    Status
                  </th>
                </tr>

              </thead>

              <tbody>

                {classes.map((item) => (

                  <tr
                    key={item.name}
                    className="border-b border-slate-800/70 hover:bg-slate-800/40"
                  >

                    <td className="px-4 py-5 font-bold">
                      {item.name}
                    </td>

                    <td className="px-4 py-5 text-slate-400">
                      {item.total}
                    </td>

                    <td className="px-4 py-5 text-cyan-400">
                      {item.screened}
                    </td>

                    <td className="px-4 py-5 text-slate-400">
                      {item.total - item.screened}
                    </td>

                    <td className="px-4 py-5 text-amber-400">
                      {item.followUp}
                    </td>

                    <td className="px-4 py-5">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.followUp > 0
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-emerald-400/10 text-emerald-400"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

        {/* QUICK ACTION */}

        <section className="mt-8 grid gap-5 md:grid-cols-3">

          <a
            href="/screening"
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400"
          >

            <p className="text-2xl">
              🩺
            </p>

            <h3 className="mt-4 font-bold">
              Mulai Screening
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Jalankan screening TB siswa.
            </p>

          </a>

          <a
            href="/edukasi"
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400"
          >

            <p className="text-2xl">
              📚
            </p>

            <h3 className="mt-4 font-bold">
              Pusat Edukasi
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Materi edukasi mengenai TB.
            </p>

          </a>

          <a
            href="/login"
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400"
          >

            <p className="text-2xl">
              👤
            </p>

            <h3 className="mt-4 font-bold">
              Kelola Akun
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Pengaturan akun guru dan UKS.
            </p>

          </a>

        </section>

      </div>

    </main>
  );
}