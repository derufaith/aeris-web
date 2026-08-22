"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const kelas10 = Array.from({ length: 11 }, (_, i) => `XE${i + 1}`);
const kelas11 = Array.from({ length: 11 }, (_, i) => `XIF${i + 1}`);
const kelas12 = Array.from({ length: 11 }, (_, i) => `XIIF${i + 1}`);

export default function IdentitasPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [noHp, setNoHp] = useState("");
  const [mediaSosial, setMediaSosial] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!kelas) {
      setError("Silakan pilih kelas.");
      return;
    }

    if (!noHp.trim()) {
      setError("Nomor HP wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from("users")
        .insert({
          nama: nama.trim(),
          kelas,
          no_hp: noHp.trim(),
          media_sosial: mediaSosial.trim() || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error(insertError);
        setError("Data gagal disimpan. Silakan coba lagi.");
        return;
      }

      localStorage.setItem(
        "aeris_user",
        JSON.stringify({
          id: data.id,
          nama: data.nama,
          kelas: data.kelas,
          no_hp: data.no_hp,
          media_sosial: data.media_sosial,
        })
      );

      router.push("/screening");

    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan pada sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050b14] text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-cyan-400 text-sm font-semibold tracking-[0.3em] mb-3">
            AERIS SYSTEM
          </div>

          <h1 className="text-3xl font-bold">
            Identitas Pengguna
          </h1>

          <p className="text-gray-400 mt-3 text-sm">
            Lengkapi data sebelum memulai screening.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-cyan-400/20 rounded-2xl p-6 shadow-2xl backdrop-blur"
        >

          {/* NAMA */}
          <label className="block mb-2 text-sm text-gray-300">
            Nama Lengkap
          </label>

          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama lengkap"
            className="w-full mb-5 px-4 py-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
          />

          {/* KELAS */}
          <label className="block mb-2 text-sm text-gray-300">
            Kelas
          </label>

          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="w-full mb-5 px-4 py-3 rounded-xl bg-[#101a27] border border-white/10 outline-none focus:border-cyan-400"
          >
            <option value="">Pilih kelas</option>

            <optgroup label="Kelas 10">
              {kelas10.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>

            <optgroup label="Kelas 11">
              {kelas11.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>

            <optgroup label="Kelas 12">
              {kelas12.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>
          </select>

          {/* NOMOR HP */}
          <label className="block mb-2 text-sm text-gray-300">
            Nomor HP
          </label>

          <input
            type="tel"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full mb-5 px-4 py-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
          />

          {/* MEDIA SOSIAL */}
          <label className="block mb-2 text-sm text-gray-300">
            Media Sosial
            <span className="text-gray-500 ml-2">
              (opsional)
            </span>
          </label>

          <input
            type="text"
            value={mediaSosial}
            onChange={(e) => setMediaSosial(e.target.value)}
            placeholder="@username"
            className="w-full mb-6 px-4 py-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
          />

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-black transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading
              ? "Menyimpan..."
              : "Mulai Screening →"}
          </button>

        </form>

        <p className="mt-6 text-center text-xs text-gray-600">
          AERIS • Airborne Exposure Risk & Infection Screening System
        </p>

      </div>
    </main>
  );
}