"use client";

import { useState } from "react";

type Answer = "yes" | "no";

type Question = {
  id: string;
  category: "Gejala" | "Paparan" | "Faktor Risiko";
  question: string;
  description: string;
  core?: boolean;
};

const questions: Question[] = [
  // =========================
  // GEJALA
  // =========================
  {
    id: "cough",
    category: "Gejala",
    question: "Apakah kamu mengalami batuk?",
    description:
      "Batuk merupakan salah satu gejala utama yang digunakan dalam screening TB.",
    core: true,
  },
  {
    id: "cough_long",
    category: "Gejala",
    question: "Apakah batuk tersebut berlangsung atau menetap cukup lama?",
    description:
      "Batuk yang menetap perlu mendapat perhatian dan evaluasi tenaga kesehatan.",
    core: true,
  },
  {
    id: "sputum",
    category: "Gejala",
    question: "Apakah kamu mengalami batuk berdahak?",
    description:
      "Dahak dapat muncul pada penyakit saluran pernapasan, termasuk TB paru.",
  },
  {
    id: "blood",
    category: "Gejala",
    question: "Apakah pernah terdapat darah ketika batuk?",
    description:
      "Batuk berdarah merupakan tanda yang memerlukan evaluasi medis.",
    core: true,
  },
  {
    id: "fever",
    category: "Gejala",
    question: "Apakah kamu mengalami demam yang tidak jelas penyebabnya?",
    description:
      "Demam merupakan salah satu gejala yang digunakan dalam screening TB.",
    core: true,
  },
  {
    id: "night_sweats",
    category: "Gejala",
    question: "Apakah kamu sering berkeringat pada malam hari?",
    description:
      "Keringat malam yang tidak biasa dapat menjadi salah satu gejala TB.",
    core: true,
  },
  {
    id: "weight_loss",
    category: "Gejala",
    question:
      "Apakah berat badanmu menurun tanpa alasan yang jelas?",
    description:
      "Penurunan berat badan yang tidak disengaja dapat menjadi gejala TB.",
    core: true,
  },
  {
    id: "appetite",
    category: "Gejala",
    question: "Apakah nafsu makanmu menurun secara tidak biasa?",
    description:
      "Penurunan nafsu makan dapat menyertai penyakit TB.",
  },
  {
    id: "chest_pain",
    category: "Gejala",
    question: "Apakah kamu mengalami nyeri dada yang tidak biasa?",
    description:
      "Nyeri dada termasuk gejala yang dapat ditemukan pada TB.",
  },
  {
    id: "fatigue",
    category: "Gejala",
    question:
      "Apakah kamu sering merasa lemah atau sangat mudah lelah tanpa alasan yang jelas?",
    description:
      "Kelemahan dan kelelahan termasuk gejala yang dapat muncul pada TB.",
  },

  // =========================
  // PAPARAN
  // =========================
  {
    id: "household_contact",
    category: "Paparan",
    question:
      "Apakah kamu tinggal serumah dengan seseorang yang sedang atau pernah menjalani pengobatan TB?",
    description:
      "Kontak serumah dengan pasien TB merupakan kelompok yang diprioritaskan untuk screening.",
    core: true,
  },
  {
    id: "close_contact",
    category: "Paparan",
    question:
      "Apakah kamu sering melakukan kontak dekat dengan seseorang yang menderita TB?",
    description:
      "Kontak dekat merupakan faktor penting dalam penilaian risiko TB.",
    core: true,
  },
  {
    id: "crowded",
    category: "Paparan",
    question:
      "Apakah kamu sering berada dalam ruangan tertutup dan padat bersama banyak orang?",
    description:
      "Lingkungan dengan kepadatan tinggi dapat meningkatkan peluang paparan penularan melalui udara.",
  },
  {
    id: "poor_ventilation",
    category: "Paparan",
    question:
      "Apakah kamu sering berada di ruangan dengan ventilasi atau sirkulasi udara yang buruk?",
    description:
      "Ventilasi yang baik merupakan bagian penting dari pencegahan penularan TB melalui udara.",
  },
  {
    id: "tb_history",
    category: "Paparan",
    question:
      "Apakah kamu pernah didiagnosis atau menjalani pengobatan TB sebelumnya?",
    description:
      "Riwayat TB sebelumnya merupakan faktor yang perlu diperhatikan dalam evaluasi.",
  },

  // =========================
  // FAKTOR RISIKO
  // =========================
  {
    id: "diabetes",
    category: "Faktor Risiko",
    question:
      "Apakah kamu pernah diberitahu oleh tenaga kesehatan bahwa kamu memiliki diabetes?",
    description:
      "Diabetes merupakan salah satu kondisi yang berhubungan dengan peningkatan risiko TB.",
  },
  {
    id: "immune",
    category: "Faktor Risiko",
    question:
      "Apakah kamu memiliki kondisi atau sedang menjalani pengobatan yang dapat melemahkan sistem kekebalan tubuh?",
    description:
      "Sistem kekebalan yang melemah dapat meningkatkan risiko berkembangnya TB.",
  },
  {
    id: "lung_disease",
    category: "Faktor Risiko",
    question:
      "Apakah kamu memiliki penyakit paru atau gangguan pernapasan kronis yang pernah didiagnosis tenaga kesehatan?",
    description:
      "Penyakit paru kronis termasuk faktor yang dapat dipertimbangkan dalam screening TB.",
  },
  {
    id: "undernutrition",
    category: "Faktor Risiko",
    question:
      "Apakah tenaga kesehatan pernah menyampaikan bahwa kamu mengalami kekurangan gizi?",
    description:
      "Kekurangan gizi berhubungan dengan peningkatan risiko TB.",
  },
  {
    id: "high_risk_area",
    category: "Faktor Risiko",
    question:
      "Apakah kamu tinggal atau sering berada di lingkungan yang diketahui memiliki risiko TB tinggi?",
    description:
      "Kondisi epidemiologi lingkungan dapat memengaruhi prioritas screening.",
  },
];

export default function ScreeningPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[step];

  const handleAnswer = (answer: Answer) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: answer,
    };

    setAnswers(updatedAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const resetScreening = () => {
    setStep(0);
    setAnswers({});
    setFinished(false);
  };

  // =========================
  // HASIL SCREENING
  // =========================

  if (finished) {
    const symptomQuestions = questions.filter(
      (q) => q.category === "Gejala"
    );

    const exposureQuestions = questions.filter(
      (q) => q.category === "Paparan"
    );

    const riskQuestions = questions.filter(
      (q) => q.category === "Faktor Risiko"
    );

    const positiveSymptoms = symptomQuestions.filter(
      (q) => answers[q.id] === "yes"
    );

    const positiveExposure = exposureQuestions.filter(
      (q) => answers[q.id] === "yes"
    );

    const positiveRisks = riskQuestions.filter(
      (q) => answers[q.id] === "yes"
    );

    const corePositive = questions.some(
      (q) => q.core && answers[q.id] === "yes"
    );

    const highPriority =
      answers.blood === "yes" ||
      positiveExposure.some(
        (q) =>
          q.id === "household_contact" ||
          q.id === "close_contact"
      );

    let resultTitle = "";
    let resultLabel = "";
    let resultDescription = "";
    let resultColor = "";

    if (highPriority) {
      resultLabel = "PRIORITAS EVALUASI";
      resultTitle = "Diperlukan tindak lanjut tenaga kesehatan";
      resultDescription =
        "Jawaban menunjukkan tanda atau riwayat paparan yang perlu mendapatkan perhatian lebih lanjut. Hasil ini bukan diagnosis TB.";
      resultColor = "amber";
    } else if (corePositive) {
      resultLabel = "PERLU EVALUASI";
      resultTitle = "Ditemukan indikator yang perlu ditindaklanjuti";
      resultDescription =
        "Terdapat gejala yang termasuk dalam indikator screening TB. Pemeriksaan lebih lanjut oleh tenaga kesehatan diperlukan untuk menentukan penyebabnya.";
      resultColor = "orange";
    } else if (positiveRisks.length > 0) {
      resultLabel = "RISIKO TERIDENTIFIKASI";
      resultTitle = "Terdapat faktor yang perlu diperhatikan";
      resultDescription =
        "Tidak ditemukan indikator gejala utama dalam jawaban, tetapi terdapat faktor risiko yang dapat menjadi pertimbangan untuk evaluasi lebih lanjut.";
      resultColor = "yellow";
    } else {
      resultLabel = "SCREENING NEGATIF";
      resultTitle = "Tidak ditemukan indikator screening utama";
      resultDescription =
        "Berdasarkan jawaban yang diberikan, tidak ditemukan gejala utama atau faktor paparan yang ditanyakan dalam screening ini.";
      resultColor = "green";
    }

    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl">

          <p className="text-sm font-bold tracking-[0.35em] text-cyan-400">
            AERIS
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Hasil Screening TB
          </h1>

          <div
            className={`mt-8 rounded-3xl border p-8 ${
              resultColor === "green"
                ? "border-emerald-500/30 bg-emerald-950/20"
                : resultColor === "yellow"
                ? "border-yellow-500/30 bg-yellow-950/20"
                : resultColor === "orange"
                ? "border-orange-500/30 bg-orange-950/20"
                : "border-amber-500/30 bg-amber-950/20"
            }`}
          >

            <p className="text-sm font-bold tracking-[0.2em]">
              {resultLabel}
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              {resultTitle}
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              {resultDescription}
            </p>

          </div>

          {/* RINGKASAN */}

          <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

            <h3 className="text-xl font-bold">
              Ringkasan Screening
            </h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Gejala
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {positiveSymptoms.length}
                </p>
                <p className="text-xs text-slate-500">
                  indikator ditemukan
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Paparan
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {positiveExposure.length}
                </p>
                <p className="text-xs text-slate-500">
                  indikator ditemukan
                </p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Faktor Risiko
                </p>
                <p className="mt-2 text-3xl font-bold">
                  {positiveRisks.length}
                </p>
                <p className="text-xs text-slate-500">
                  indikator ditemukan
                </p>
              </div>

            </div>

          </section>

          {/* INDIKATOR */}

          {(positiveSymptoms.length > 0 ||
            positiveExposure.length > 0 ||
            positiveRisks.length > 0) && (
            <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

              <h3 className="text-xl font-bold">
                Indikator yang terjawab "Ya"
              </h3>

              <div className="mt-5 space-y-3">

                {[
                  ...positiveSymptoms,
                  ...positiveExposure,
                  ...positiveRisks,
                ].map((q) => (
                  <div
                    key={q.id}
                    className="rounded-xl bg-slate-800 p-4"
                  >
                    <p className="font-medium">
                      {q.question}
                    </p>

                    <p className="mt-1 text-sm text-cyan-400">
                      {q.category}
                    </p>
                  </div>
                ))}

              </div>

            </section>
          )}

          {/* DISCLAIMER */}

          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-xs leading-6 text-slate-500">
              AERIS adalah alat bantu screening awal. Hasil
              screening tidak dapat digunakan untuk memastikan
              seseorang menderita atau tidak menderita tuberkulosis.
              Screening positif memerlukan evaluasi dan pemeriksaan
              lebih lanjut oleh tenaga kesehatan.
            </p>

          </section>

          <button
            onClick={resetScreening}
            className="mt-8 w-full rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 hover:bg-cyan-300"
          >
            Ulangi Screening
          </button>

        </div>
      </main>
    );
  }

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-3xl">

        <p className="text-sm font-bold tracking-[0.35em] text-cyan-400">
          AERIS
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          TB Screening
        </h1>

        <p className="mt-3 leading-7 text-slate-400">
          Screening awal berdasarkan gejala, paparan, dan faktor
          risiko yang relevan dengan tuberkulosis.
        </p>

        {/* PROGRESS */}

        <div className="mt-10">

          <div className="mb-3 flex justify-between text-sm text-slate-500">

            <span>
              Pertanyaan {step + 1} / {questions.length}
            </span>

            <span>
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* QUESTION CARD */}

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

          <div className="flex items-center justify-between">

            <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-400">
              {currentQuestion.category}
            </span>

            <span className="text-sm text-slate-600">
              AERIS
            </span>

          </div>

          <h2 className="mt-8 text-3xl font-bold leading-tight">
            {currentQuestion.question}
          </h2>

          <p className="mt-5 leading-7 text-slate-400">
            {currentQuestion.description}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">

            <button
              onClick={() => handleAnswer("yes")}
              className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-5 text-lg font-bold transition hover:border-cyan-400 hover:bg-slate-700"
            >
              Ya
            </button>

            <button
              onClick={() => handleAnswer("no")}
              className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-5 text-lg font-bold transition hover:border-cyan-400 hover:bg-slate-700"
            >
              Tidak
            </button>

          </div>

        </section>

        <p className="mt-8 text-center text-xs leading-6 text-slate-600">
          Screening ini bersifat informatif dan bukan pengganti
          diagnosis atau pemeriksaan tenaga kesehatan.
        </p>

      </div>

    </main>
  );
}