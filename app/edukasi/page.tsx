<a
  href="/edukasi"
  className="group rounded-3xl border border-slate-800 bg-slate-900 p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400"
>
  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
    📚
  </div>

  <h2 className="mt-6 text-xl font-bold group-hover:text-cyan-400">
    Edukasi
  </h2>

  <p className="mt-3 leading-7 text-slate-500">
    Pelajari informasi mengenai TBC, gejala,
    pencegahan, dan kesehatan sekolah.
  </p>

  <p className="mt-5 text-sm font-bold text-cyan-400">
    Buka Edukasi →
  </p>
</a>
const materials = [
  {
    title: "Mengenal Tuberkulosis",
    icon: "🫁",
    text: "Tuberkulosis atau TB adalah penyakit infeksi yang paling sering menyerang paru-paru.",
  },
  {
    title: "Kenali Gejalanya",
    icon: "🔎",
    text: "Kenali tanda seperti batuk yang menetap, demam, keringat malam, penurunan berat badan, lemah, dan gejala lain yang perlu dievaluasi.",
  },
  {
    title: "Bagaimana TB Menular?",
    icon: "💨",
    text: "TB dapat menyebar melalui udara ketika seseorang dengan TB paru yang menular batuk atau bersin.",
  },
  {
    title: "Pencegahan",
    icon: "🛡️",
    text: "Ventilasi yang baik, etika batuk, mencari pertolongan medis ketika memiliki gejala, dan mengikuti anjuran tenaga kesehatan merupakan bagian dari pencegahan.",
  },
  {
    title: "Kapan Harus Memeriksakan Diri?",
    icon: "🏥",
    text: "Jika memiliki gejala atau riwayat kontak dengan pasien TB, konsultasikan kondisi tersebut kepada tenaga kesehatan.",
  },
  {
    title: "Mitos vs Fakta",
    icon: "💡",
    text: "Pelajari fakta mengenai TB dan hindari stigma terhadap orang yang sedang menjalani pengobatan.",
  },
];

export default function EdukasiPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-6xl">

        <a
          href="/"
          className="text-sm text-cyan-400"
        >
          ← Kembali ke AERIS
        </a>

        <div className="mt-10">

          <p className="text-sm font-bold tracking-[0.3em] text-cyan-400">
            AERIS EDUCATION
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Pusat Edukasi TB
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Informasi singkat dan mudah dipahami untuk membantu
            siswa, guru, dan petugas UKS mengenali TB.
          </p>

        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {materials.map((material) => (

            <article
              key={material.title}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-cyan-400"
            >

              <div className="text-4xl">
                {material.icon}
              </div>

              <h2 className="mt-6 text-xl font-bold">
                {material.title}
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                {material.text}
              </p>

            </article>

          ))}

        </section>

        <section className="mt-10 rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-8">

          <p className="text-sm font-bold text-cyan-400">
            PENTING
          </p>

          <p className="mt-3 leading-7 text-slate-300">
            Materi edukasi AERIS bertujuan meningkatkan pengetahuan
            dan kesadaran. Informasi di dalamnya bukan pengganti
            diagnosis atau konsultasi tenaga kesehatan.
          </p>

        </section>

      </div>

    </main>
  );
}