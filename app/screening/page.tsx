"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type User = {
  id: string;
  nama: string;
  kelas: string;
  no_hp?: string;
  media_sosial?: string;
};

type Jawaban = {
  [key: string]: string;
};

const pertanyaan = [
  {
    id: "batuk",
    pertanyaan: "Apakah Anda sedang mengalami batuk?",
    pilihan: ["Tidak", "Ya"],
    bobot: 2,
  },
  {
    id: "durasi_batuk",
    pertanyaan: "Jika batuk, apakah sudah berlangsung selama 2 minggu atau lebih?",
    pilihan: ["Tidak", "Ya"],
    bobot: 4,
  },
  {
    id: "dahak",
    pertanyaan: "Apakah batuk disertai dahak?",
    pilihan: ["Tidak", "Ya"],
    bobot: 2,
  },
  {
    id: "darah",
    pertanyaan: "Apakah pernah terdapat darah pada dahak?",
    pilihan: ["Tidak", "Ya"],
    bobot: 5,
  },
  {
    id: "demam",
    pertanyaan: "Apakah mengalami demam atau meriang tanpa sebab yang jelas?",
    pilihan: ["Tidak", "Ya"],
    bobot: 3,
  },
  {
    id: "keringat_malam",
    pertanyaan:
      "Apakah sering berkeringat pada malam hari tanpa aktivitas fisik berat?",
    pilihan: ["Tidak", "Ya"],
    bobot: 3,
  },
  {
    id: "berat_badan",
    pertanyaan: "Apakah mengalami penurunan berat badan tanpa sebab yang jelas?",
    pilihan: ["Tidak", "Ya"],
    bobot: 4,
  },
  {
    id: "nafsu_makan",
    pertanyaan: "Apakah mengalami penurunan nafsu makan?",
    pilihan: ["Tidak", "Ya"],
    bobot: 2,
  },
  {
    id: "lelah",
    pertanyaan: "Apakah sering merasa lemah atau sangat mudah lelah?",
    pilihan: ["Tidak", "Ya"],
    bobot: 2,
  },
  {
    id: "sesak",
    pertanyaan: "Apakah mengalami sesak napas?",
    pilihan: ["Tidak", "Ya"],
    bobot: 2,
  },
  {
    id: "nyeri_dada",
    pertanyaan:
      "Apakah mengalami nyeri dada, terutama ketika bernapas atau batuk?",
    pilihan: ["Tidak", "Ya"],
    bobot: 2,
  },
  {
    id: "kontak_tbc",
    pertanyaan:
      "Apakah pernah melakukan kontak erat dengan seseorang yang didiagnosis TBC?",
    pilihan: ["Tidak", "Ya"],
    bobot: 4,
  },
];

export default function ScreeningPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [jawaban, setJawaban] = useState<Jawaban>({});
  const [current, setCurrent] = useState(0);

  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<number | null>(null);
  const [kategori, setKategori] = useState("");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("aeris_user");

    if (!savedUser) {
      router.replace("/identitas");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("aeris_user");
      router.replace("/identitas");
    }
  }, [router]);

  function pilihJawaban(value: string) {
    setJawaban((prev) => ({
      ...prev,
      [pertanyaan[current].id]: value,
    }));
  }

  function hitungIndeks() {
    let total = 0;
    let maksimum = 0;

    pertanyaan.forEach((item) => {
      maksimum += item.bobot;

      if (jawaban[item.id] === "Ya") {
        total += item.bobot;
      }
    });

    return Math.round((total / maksimum) * 100);
  }

  function tentukanKategori(indeks: number) {
    if (indeks < 25) {
      return {
        kategori: "Indeks Gejala Rendah",
        catatan:
          "Tidak ditemukan banyak gejala yang teridentifikasi dalam skrining ini.",
      };
    }

    if (indeks < 50) {
      return {
        kategori: "Perlu Perhatian",
        catatan:
          "Terdapat beberapa gejala atau faktor yang perlu diperhatikan.",
      };
    }

    if (indeks < 75) {
      return {
        kategori: "Perlu Evaluasi",
        catatan:
          "Terdapat kombinasi gejala atau faktor yang memerlukan perhatian lebih lanjut.",
      };
    }

    return {
      kategori: "Prioritas Tindak Lanjut",
      catatan:
        "Terdapat beberapa gejala atau faktor yang cukup menonjol sehingga disarankan melakukan evaluasi kesehatan lebih lanjut.",
    };
  }

  async function submitScreening() {
    if (!user) return;

    const semuaTerjawab = pertanyaan.every(
      (item) => jawaban[item.id] !== undefined
    );

    if (!semuaTerjawab) {
      alert("Mohon jawab seluruh pertanyaan terlebih dahulu.");
      return;
    }

    setLoading(true);

    const indeks = hitungIndeks();
    const hasilKategori = tentukanKategori(indeks);

    const { error } = await supabase.from("screenings").insert({
      user_id: user.id,
      hasil: hasilKategori.kategori,
      skor: indeks,
      indeks_gejala: indeks,
      jawaban: jawaban,
      kategori: hasilKategori.kategori,
      catatan: hasilKategori.catatan,
    });

    if (error) {
      console.error(error);
      alert("Data screening gagal disimpan.");
      setLoading(false);
      return;
    }

    setHasil(indeks);
    setKategori(hasilKategori.kategori);
    setCatatan(hasilKategori.catatan);
    setLoading(false);
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-cyan-400">Memuat identitas...</p>
      </main>
    );
  }

  if (hasil !== null) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-xl">

          <div className="text-center mb-8">
            <p className="text-cyan-400 font-bold tracking-widest">
              AERIS SCREENING
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Hasil Skrining
            </h1>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 text-center">

            <p className="text-slate-400">
              Indeks Skrining AERIS
            </p>

            <div className="my-6 text-7xl font-black text-cyan-400">
              {hasil}%
            </div>

            <h2 className="text-2xl font-bold">
              {kategori}
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              {catatan}
            </p>

            <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-300">
              Hasil ini merupakan skrining awal dan bukan diagnosis TBC.
              Jika memiliki gejala yang mengkhawatirkan, konsultasikan
              dengan tenaga kesehatan.
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => router.push("/")}
                className="rounded-xl border border-slate-700 px-5 py-3 font-bold hover:border-cyan-400"
              >
                Kembali ke Beranda
              </button>

              <button
                onClick={() => router.push("/edukasi")}
                className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300"
              >
                Pelajari TBC
              </button>
            </div>

          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Data screening telah disimpan ke sistem AERIS.
          </p>

        </div>
      </main>
    );
  }

  const item = pertanyaan[current];
  const progress = Math.round(
    ((current + 1) / pertanyaan.length) * 100
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="mx-auto max-w-3xl">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-cyan-400 font-bold tracking-widest text-sm">
            AERIS SCREENING
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Skrining Gejala & Faktor Risiko
          </h1>

          <p className="mt-3 text-slate-400">
            {user.nama} • {user.kelas}
          </p>
        </div>

        {/* PROGRESS */}

        <div className="mb-8">

          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>
              Pertanyaan {current + 1} dari {pertanyaan.length}
            </span>

            <span>{progress}%</span>
          </div>

          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        {/* QUESTION */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 md:p-10">

          <p className="text-sm text-cyan-400 font-bold">
            Pertanyaan {current + 1}
          </p>

          <h2 className="mt-4 text-2xl font-bold leading-relaxed">
            {item.pertanyaan}
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">

            {item.pilihan.map((pilihan) => {
              const aktif = jawaban[item.id] === pilihan;

              return (
                <button
                  key={pilihan}
                  onClick={() => pilihJawaban(pilihan)}
                  className={`rounded-2xl border px-6 py-5 text-left font-bold transition ${
                    aktif
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                      : "border-slate-700 hover:border-cyan-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{pilihan}</span>

                    {aktif && (
                      <span className="text-cyan-400">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

          </div>

          {/* NAVIGATION */}

          <div className="mt-10 flex justify-between gap-4">

            <button
              onClick={() =>
                setCurrent((prev) => Math.max(prev - 1, 0))
              }
              disabled={current === 0}
              className="rounded-xl border border-slate-700 px-5 py-3 font-bold disabled:opacity-30"
            >
              ← Kembali
            </button>

            {current < pertanyaan.length - 1 ? (
              <button
                onClick={() => {
                  if (!jawaban[item.id]) {
                    alert("Pilih salah satu jawaban terlebih dahulu.");
                    return;
                  }

                  setCurrent((prev) => prev + 1);
                }}
                className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
              >
                Berikutnya →
              </button>
            ) : (
              <button
                onClick={submitScreening}
                disabled={loading || !jawaban[item.id]}
                className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Selesai Screening ✓"}
              </button>
            )}

          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Skrining awal • Bukan diagnosis medis
        </p>

      </div>

    </main>
  );
}