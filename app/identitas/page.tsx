"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const kelasSiswa = [
  "X-E1",
  "X-E2",
  "X-E3",
  "X-E4",
  "X-E5",
  "X-E6",
  "X-E7",
  "X-E8",
  "X-E9",
  "X-E10",
  "X-E11",

  "XI-F1",
  "XI-F2",
  "XI-F3",
  "XI-F4",
  "XI-F5",
  "XI-F6",
  "XI-F7",
  "XI-F8",
  "XI-F9",
  "XI-F10",
  "XI-F11",

  "XII-F1",
  "XII-F2",
  "XII-F3",
  "XII-F4",
  "XII-F5",
  "XII-F6",
  "XII-F7",
  "XII-F8",
  "XII-F9",
  "XII-F10",
  "XII-F11",
];

const pilihanGuru = [
  "Tenaga Pendidik",
  "Tenaga Administrasi",
  "Rumpun Pendidik",
];

export default function IdentitasPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");

  const [jenis, setJenis] = useState("");
  const [detail, setDetail] = useState("");

  const [loading, setLoading] = useState(false);

  function pilihJenis(value: string) {
    setJenis(value);
    setDetail("");
  }

  async function lanjutkan() {
    if (!nama.trim()) {
      alert("Silakan masukkan nama.");
      return;
    }

    if (!noHp.trim()) {
      alert("Silakan masukkan nomor HP.");
      return;
    }

    if (!jenis) {
      alert("Silakan pilih jenis pengguna.");
      return;
    }

    if (!detail) {
      alert("Silakan pilih kategori Anda.");
      return;
    }

    setLoading(true);

    let kelasDatabase = "";

    if (jenis === "Siswa") {
      kelasDatabase = `Siswa - ${detail}`;
    }

    if (jenis === "Guru") {
      kelasDatabase = `Guru - ${detail}`;
    }

    if (jenis === "Warga Sekolah Lainnya") {
      kelasDatabase = `Warga Sekolah Lainnya - ${detail}`;
    }

    // Simpan ke Supabase
    const { data, error } = await supabase
      .from("users")
      .insert({
        nama: nama.trim(),
        no_hp: noHp.trim(),
        kelas: kelasDatabase,
      })
      .select()
      .single();

    if (error) {
      console.error("SUPABASE ERROR:", error);

      alert(
        `Gagal menyimpan data:\n\n${error.message}\n\nKode: ${error.code ?? "-"}`
      );

      setLoading(false);
      return;
    }

    // Simpan identitas sementara di browser
    localStorage.setItem("aeris_user", JSON.stringify(data));

    setLoading(false);

    // Masuk ke screening
    router.push("/screening");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10 flex items-center justify-center">

      <div className="w-full max-w-xl">

        {/* HEADER */}

        <div className="text-center mb-10">

          <p className="text-cyan-400 font-bold tracking-[0.3em] text-sm">
            AERIS
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Identitas Pengguna
          </h1>

          <p className="mt-3 text-slate-400">
            Lengkapi data sebelum memulai screening.
          </p>

        </div>

        {/* CARD */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 md:p-9">

          {/* NAMA */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-bold text-slate-300">
              Nama Lengkap
            </label>

            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
            />

          </div>

          {/* NOMOR HP */}

          <div className="mb-8">

            <label className="mb-2 block text-sm font-bold text-slate-300">
              Nomor HP
            </label>

            <input
              type="tel"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
            />

          </div>

          {/* JENIS PENGGUNA */}

          <div className="mb-8">

            <label className="mb-3 block text-sm font-bold text-slate-300">
              Anda adalah
            </label>

            <div className="grid gap-3">

              {/* SISWA */}

              <button
                type="button"
                onClick={() => pilihJenis("Siswa")}
                className={`rounded-2xl border p-5 text-left transition ${
                  jenis === "Siswa"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 hover:border-cyan-400"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="font-bold">
                      1. Siswa
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Peserta didik SMA Negeri 3 Cilacap
                    </p>
                  </div>

                  {jenis === "Siswa" && (
                    <span className="text-xl text-cyan-400">
                      ✓
                    </span>
                  )}

                </div>

              </button>

              {/* GURU */}

              <button
                type="button"
                onClick={() => pilihJenis("Guru")}
                className={`rounded-2xl border p-5 text-left transition ${
                  jenis === "Guru"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 hover:border-cyan-400"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="font-bold">
                      2. Guru
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Tenaga pendidik dan administrasi
                    </p>
                  </div>

                  {jenis === "Guru" && (
                    <span className="text-xl text-cyan-400">
                      ✓
                    </span>
                  )}

                </div>

              </button>

              {/* WARGA SEKOLAH */}

              <button
                type="button"
                onClick={() =>
                  pilihJenis("Warga Sekolah Lainnya")
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  jenis === "Warga Sekolah Lainnya"
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 hover:border-cyan-400"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="font-bold">
                      3. Warga Sekolah Lainnya
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Karyawan / Kantin
                    </p>
                  </div>

                  {jenis === "Warga Sekolah Lainnya" && (
                    <span className="text-xl text-cyan-400">
                      ✓
                    </span>
                  )}

                </div>

              </button>

            </div>

          </div>

          {/* PILIHAN SISWA */}

          {jenis === "Siswa" && (
            <div className="mb-8">

              <label className="mb-2 block text-sm font-bold text-slate-300">
                Pilih Kelas
              </label>

              <select
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-400"
              >

                <option value="">
                  -- Pilih kelas --
                </option>

                <optgroup label="Kelas X">
                  {kelasSiswa
                    .filter((kelas) =>
                      kelas.startsWith("X-")
                    )
                    .map((kelas) => (
                      <option
                        key={kelas}
                        value={kelas}
                      >
                        {kelas}
                      </option>
                    ))}
                </optgroup>

                <optgroup label="Kelas XI">
                  {kelasSiswa
                    .filter((kelas) =>
                      kelas.startsWith("XI-")
                    )
                    .map((kelas) => (
                      <option
                        key={kelas}
                        value={kelas}
                      >
                        {kelas}
                      </option>
                    ))}
                </optgroup>

                <optgroup label="Kelas XII">
                  {kelasSiswa
                    .filter((kelas) =>
                      kelas.startsWith("XII-")
                    )
                    .map((kelas) => (
                      <option
                        key={kelas}
                        value={kelas}
                      >
                        {kelas}
                      </option>
                    ))}
                </optgroup>

              </select>

            </div>
          )}

          {/* PILIHAN GURU */}

          {jenis === "Guru" && (
            <div className="mb-8">

              <label className="mb-2 block text-sm font-bold text-slate-300">
                Pilih Kategori Guru
              </label>

              <select
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-400"
              >

                <option value="">
                  -- Pilih kategori --
                </option>

                {pilihanGuru.map((pilihan) => (
                  <option
                    key={pilihan}
                    value={pilihan}
                  >
                    {pilihan}
                  </option>
                ))}

              </select>

            </div>
          )}

          {/* WARGA SEKOLAH LAINNYA */}

          {jenis === "Warga Sekolah Lainnya" && (
            <div className="mb-8">

              <label className="mb-3 block text-sm font-bold text-slate-300">
                Pilih Kategori
              </label>

              <div className="grid grid-cols-2 gap-3">

                {["Karyawan", "Kantin"].map(
                  (pilihan) => {

                    const aktif =
                      detail === pilihan;

                    return (
                      <button
                        type="button"
                        key={pilihan}
                        onClick={() =>
                          setDetail(pilihan)
                        }
                        className={`rounded-xl border p-4 font-bold transition ${
                          aktif
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                            : "border-slate-700 hover:border-cyan-400"
                        }`}
                      >
                        {pilihan}

                        {aktif && (
                          <span className="ml-2">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  }
                )}

              </div>

            </div>
          )}

          {/* TOMBOL */}

          <button
            onClick={lanjutkan}
            disabled={loading}
            className="w-full rounded-xl bg-cyan-400 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading
              ? "Menyimpan..."
              : "Lanjut ke Screening →"}
          </button>

        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Data digunakan untuk sistem screening AERIS.
        </p>

      </div>

    </main>
  );
}