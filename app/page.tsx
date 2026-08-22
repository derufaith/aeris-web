import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black text-cyan-400">
            AERIS
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/identitas" className="hover:text-cyan-400">
              Screening
            </Link>

            <Link href="/dashboard" className="hover:text-cyan-400">
              Dashboard
            </Link>

            <Link href="/edukasi" className="hover:text-cyan-400">
              Edukasi
            </Link>

            <Link
              href="/login"
              className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-950"
            >
              Akun
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="mb-5 font-bold uppercase tracking-widest text-cyan-400">
            School Health System
          </p>

          <h1 className="text-5xl font-black leading-tight md:text-7xl">
            Deteksi dini.
            <br />
            <span className="text-cyan-400">Lindungi sekolah.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            AERIS adalah sistem kesehatan sekolah untuk membantu
            screening risiko TBC, monitoring kesehatan siswa, dan
            edukasi kesehatan.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/identitas"
              className="rounded-2xl bg-cyan-400 px-7 py-4 font-black text-slate-950 hover:bg-cyan-300"
            >
              Mulai Screening
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-700 px-7 py-4 font-bold hover:border-cyan-400 hover:text-cyan-400"
            >
              Dashboard UKS
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-black">
            Sistem AERIS
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <Link
              href="/identitas"
              className="rounded-3xl border border-slate-800 bg-slate-900 p-7 hover:border-cyan-400"
            >
              <h3 className="text-xl font-bold text-cyan-400">
                Screening TBC
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Screening awal untuk mengidentifikasi faktor risiko
                dan gejala yang berkaitan dengan TBC.
              </p>
            </Link>

            <Link
              href="/dashboard"
              className="rounded-3xl border border-slate-800 bg-slate-900 p-7 hover:border-cyan-400"
            >
              <h3 className="text-xl font-bold text-cyan-400">
                Dashboard UKS
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Pantau hasil screening siswa berdasarkan kelas dan
                status risiko.
              </p>
            </Link>

            <Link
              href="/edukasi"
              className="rounded-3xl border border-slate-800 bg-slate-900 p-7 hover:border-cyan-400"
            >
              <h3 className="text-xl font-bold text-cyan-400">
                Edukasi
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Pelajari TBC, pencegahan, gejala, penularan, dan
                perilaku hidup sehat.
              </p>
            </Link>

          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        AERIS — School Health & Early Detection System
      </footer>
    </main>
  );
}