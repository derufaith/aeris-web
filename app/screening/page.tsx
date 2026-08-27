"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type User = {
  id: string;
  nama: string;
  kelas: string;
};

type Jawaban = {
  [key: string]: number;
};

type Pertanyaan = {
  id: string;
  pertanyaan: string;
  pilihan: {
    label: string;
    skor: number;
  }[];
};

const pertanyaan: Pertanyaan[] = [
  {
    id: "1",
    pertanyaan: "Saya mengalami batuk dalam 2 minggu terakhir.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Sering", skor: 2 },
    ],
  },
  {
    id: "2",
    pertanyaan: "Batuk saya berlangsung 2 minggu atau lebih.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Ya", skor: 2 },
    ],
  },
  {
    id: "3",
    pertanyaan: "Batuk saya terjadi berulang atau semakin sering.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Sering", skor: 2 },
    ],
  },
  {
    id: "4",
    pertanyaan: "Saya mengalami demam yang tidak jelas penyebabnya.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Ya / sering", skor: 2 },
    ],
  },
  {
    id: "5",
    pertanyaan:
      "Saya berkeringat pada malam hari tanpa sebab yang jelas.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Sering", skor: 2 },
    ],
  },
  {
    id: "6",
    pertanyaan:
      "Berat badan saya menurun secara tiba-tiba.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Sedikit", skor: 1 },
      { label: "Ya", skor: 2 },
    ],
  },
  {
    id: "7",
    pertanyaan:
      "Nafsu makan saya menurun dibandingkan biasanya.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Sering", skor: 2 },
    ],
  },
  {
    id: "8",
    pertanyaan:
      "Saya merasa lemah atau mudah lelah tanpa sebab yang jelas.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Sering", skor: 2 },
    ],
  },
  {
    id: "9",
    pertanyaan:
      "Saya mengalami sesak atau kesulitan bernapas.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Sering", skor: 2 },
    ],
  },
  {
    id: "10",
    pertanyaan:
      "Saya merasakan nyeri atau tidak nyaman di dada.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Sering", skor: 2 },
    ],
  },
  {
    id: "11",
    pertanyaan:
      "Saya mengeluarkan dahak ketika batuk.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Sering", skor: 2 },
    ],
  },
  {
    id: "12",
    pertanyaan:
      "Saya pernah tinggal serumah dengan seseorang yang menderita TBC.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Ya", skor: 2 },
    ],
  },
  {
    id: "13",
    pertanyaan:
      "Saya pernah melakukan kontak erat dengan penderita TBC.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Ya", skor: 2 },
    ],
  },
  {
    id: "14",
    pertanyaan:
      "Ada anggota keluarga saya yang pernah menjalani pengobatan TBC.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Ya", skor: 2 },
    ],
  },
  {
    id: "15",
    pertanyaan:
      "Saya pernah berada dalam lingkungan yang diketahui memiliki kasus TBC.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Ya", skor: 2 },
    ],
  },
  {
    id: "16",
    pertanyaan:
      "Saya pernah didiagnosis TBC sebelumnya.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Ya", skor: 2 },
    ],
  },
  {
    id: "17",
    pertanyaan:
      "Saya pernah menjalani pemeriksaan karena dicurigai TBC.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Ya", skor: 2 },
    ],
  },
  {
    id: "18",
    pertanyaan:
      "Saya pernah mendapatkan pengobatan TBC.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Ya", skor: 2 },
    ],
  },
  {
    id: "19",
    pertanyaan:
      "Saya mengetahui adanya riwayat kontak TBC dalam lingkungan tempat tinggal saya.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Ya", skor: 2 },
    ],
  },
  {
    id: "20",
    pertanyaan:
      "Ruang kelas memiliki ventilasi atau jendela yang memadai.",
    pilihan: [
      { label: "Ya", skor: 0 },
      { label: "Sebagian", skor: 1 },
      { label: "Tidak", skor: 2 },
    ],
  },
  {
    id: "21",
    pertanyaan:
      "Udara di ruang kelas/ruang kerja dapat bersirkulasi dengan baik.",
    pilihan: [
      { label: "Ya", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Tidak", skor: 2 },
    ],
  },
  {
    id: "22",
    pertanyaan:
      "Ruang kelas sering terasa pengap.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Sering", skor: 2 },
    ],
  },
  {
    id: "23",
    pertanyaan:
      "Jumlah siswa dalam ruang kelas terasa terlalu padat.",
    pilihan: [
      { label: "Tidak", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Sering", skor: 2 },
    ],
  },
  {
    id: "24",
    pertanyaan:
      "Ada ruangan sekolah/ruang kerja yang jarang mendapatkan udara segar.",
    pilihan: [
      { label: "Tidak tahu", skor: 0 },
      { label: "Tidak", skor: 1 },
      { label: "Ada", skor: 2 },
    ],
  },
  {
    id: "25",
    pertanyaan:
      "Saya mengetahui etika batuk dan bersin yang benar.",
    pilihan: [
      { label: "Ya", skor: 0 },
      { label: "Sebagian", skor: 1 },
      { label: "Tidak", skor: 2 },
    ],
  },
  {
    id: "26",
    pertanyaan:
      "Saya menutup mulut dan hidung ketika batuk atau bersin.",
    pilihan: [
      { label: "Selalu", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Tidak", skor: 2 },
    ],
  },
  {
    id: "27",
    pertanyaan:
      "Saya menghindari kontak dekat ketika sedang mengalami batuk atau gejala pernapasan.",
    pilihan: [
      { label: "Selalu", skor: 0 },
      { label: "Kadang", skor: 1 },
      { label: "Tidak", skor: 2 },
    ],
  },
  {
    id: "28",
    pertanyaan:
      "Saya mengetahui kepada siapa harus melapor apabila mengalami gejala TBC.",
    pilihan: [
      { label: "Ya", skor: 0 },
      { label: "Kurang tahu", skor: 1 },
      { label: "Tidak", skor: 2 },
    ],
  },
  {
    id: "29",
    pertanyaan:
      "Sekolah memiliki mekanisme untuk melaporkan warga sekolah yang mengalami gejala penyakit menular.",
    pilihan: [
      { label: "Ya", skor: 0 },
      { label: "Kurang tahu", skor: 1 },
      { label: "Tidak", skor: 2 },
    ],
  },
  {
    id: "30",
    pertanyaan:
      "Saya pernah mendapatkan edukasi mengenai pencegahan TBC di sekolah.",
    pilihan: [
      { label: "Ya", skor: 0 },
      { label: "Pernah tetapi lupa", skor: 1 },
      { label: "Tidak", skor: 2 },
    ],
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
      const parsedUser = JSON.parse(savedUser);

      if (!parsedUser.id || !parsedUser.nama) {
        throw new Error("Data pengguna tidak lengkap.");
      }

      setUser({
        id: parsedUser.id,
        nama: parsedUser.nama,
        kelas: parsedUser.kelas || "Warga Sekolah Lainnya",
      });
    } catch {
      localStorage.removeItem("aeris_user");
      router.replace("/identitas");
    }
  }, [router]);

  function pilihJawaban(skor: number) {
    setJawaban((prev) => ({
      ...prev,
      [pertanyaan[current].id]: skor,
    }));
  }

  function hitungSkor() {
    return pertanyaan.reduce((total, item) => {
      return total + (jawaban[item.id] ?? 0);
    }, 0);
  }

  function tentukanHasil(skor: number) {
    const batuk2Minggu = jawaban["2"] === 2;

    const kontakTBC =
      jawaban["12"] === 2 ||
      jawaban["13"] === 2;

    if (batuk2Minggu || kontakTBC) {
      return {
        kategori: "Prioritas Tindak Lanjut",
        catatan:
          "Terdapat indikator penting dalam hasil skrining. Disarankan melakukan konsultasi atau penilaian lebih lanjut dengan tenaga kesehatan.",
      };
    }

    if (skor <= 12) {
      return {
        kategori: "Indeks Risiko Rendah",
        catatan:
          "Indikator risiko yang teridentifikasi relatif sedikit. Tetap jaga kesehatan dan lingkungan sekolah.",
      };
    }

    if (skor <= 24) {
      return {
        kategori: "Perlu Perhatian",
        catatan:
          "Terdapat beberapa indikator yang perlu diperhatikan. Tingkatkan kewaspadaan dan terapkan perilaku pencegahan.",
      };
    }

    if (skor <= 36) {
      return {
        kategori: "Perlu Evaluasi",
        catatan:
          "Terdapat cukup banyak indikator risiko. Disarankan melakukan evaluasi lebih lanjut bersama pihak UKS atau tenaga kesehatan.",
      };
    }

    return {
      kategori: "Prioritas Tindak Lanjut",
      catatan:
        "Terdapat banyak indikator risiko. Disarankan mendapatkan penilaian lebih lanjut dari tenaga kesehatan.",
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

    const skor = hitungSkor();
    const hasilScreening = tentukanHasil(skor);

    const { error } = await supabase
      .from("screenings")
      .insert({
        user_id: user.id,

        hasil: hasilScreening.kategori,

        skor: skor,

        kategori: hasilScreening.kategori,

        catatan: hasilScreening.catatan,

        jawaban: jawaban,
      });

    if (error) {
      console.error("SUPABASE SCREENING ERROR:", error);

      alert(
        `Data screening gagal disimpan.\n\n${error.message}`
      );

      setLoading(false);
      return;
    }

    setHasil(skor);
    setKategori(hasilScreening.kategori);
    setCatatan(hasilScreening.catatan);

    setLoading(false);
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-cyan-400">
          Memuat identitas...
        </p>
      </main>
    );
  }

  // =====================================================
  // HASIL SCREENING
  // =====================================================

  if (hasil !== null) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-xl">

          <div className="text-center mb-8">

            <p className="text-cyan-400 font-bold tracking-widest">
              AERIS SCREENING
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Hasil Skrining
            </h1>

            <p className="mt-3 text-slate-500">
              {user.nama}
            </p>

          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 text-center">

            <p className="text-slate-400">
              Skor Skrining AERIS
            </p>

            <div className="my-6 text-7xl font-black text-cyan-400">

              {hasil}

              <span className="text-3xl text-slate-500">
                /60
              </span>

            </div>

            <h2 className="text-2xl font-bold">
              {kategori}
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              {catatan}
            </p>

            <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm leading-6 text-yellow-300">

              Hasil ini merupakan skrining awal dan bukan
              diagnosis TBC. Jika memiliki gejala atau
              kondisi yang mengkhawatirkan, konsultasikan
              dengan tenaga kesehatan.

            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">

              <button
                onClick={() => router.push("/")}
                className="rounded-xl border border-slate-700 px-5 py-3 font-bold transition hover:border-cyan-400"
              >
                Kembali ke Beranda
              </button>

              <button
                onClick={() => router.push("/edukasi")}
                className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
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

  const jawabanSekarang = jawaban[item.id];

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

            <span>
              {progress}%
            </span>

          </div>

          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">

            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* QUESTION CARD */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 md:p-10">

          <p className="text-sm text-cyan-400 font-bold">
            Pertanyaan {current + 1}
          </p>

          <h2 className="mt-4 text-2xl font-bold leading-relaxed">
            {item.pertanyaan}
          </h2>

          {/* PILIHAN */}

          <div className="mt-8 grid gap-4">

            {item.pilihan.map((pilihan) => {

              const aktif =
                jawabanSekarang === pilihan.skor;

              return (
                <button
                  key={pilihan.label}
                  type="button"
                  onClick={() =>
                    pilihJawaban(pilihan.skor)
                  }
                  className={`rounded-2xl border px-6 py-5 text-left font-bold transition ${
                    aktif
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                      : "border-slate-700 hover:border-cyan-400"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <span>
                      {pilihan.label}
                    </span>

                    {aktif && (
                      <span className="text-cyan-400 text-xl">
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
              type="button"
              onClick={() =>
                setCurrent((prev) =>
                  Math.max(prev - 1, 0)
                )
              }
              disabled={current === 0}
              className="rounded-xl border border-slate-700 px-5 py-3 font-bold transition hover:border-cyan-400 disabled:opacity-30"
            >
              ← Kembali
            </button>

            {current < pertanyaan.length - 1 ? (

              <button
                type="button"
                onClick={() => {

                  if (jawabanSekarang === undefined) {
                    alert(
                      "Pilih salah satu jawaban terlebih dahulu."
                    );
                    return;
                  }

                  setCurrent((prev) => prev + 1);
                }}
                className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Berikutnya →
              </button>

            ) : (

              <button
                type="button"
                onClick={submitScreening}
                disabled={
                  loading ||
                  jawabanSekarang === undefined
                }
                className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
              >
                {loading
                  ? "Menyimpan..."
                  : "Selesai Screening ✓"}
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