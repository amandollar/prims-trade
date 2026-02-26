import Link from 'next/link';
import Nav from '@/components/Nav';

const CHART_IMG = '/hero-chart.png';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden rounded-b-2xl bg-zinc-900">
          <img
            src={CHART_IMG}
            alt=""
            className="h-64 w-full object-cover opacity-60 sm:h-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trade signals, shared
            </h1>
            <p className="mt-3 max-w-md text-sm text-zinc-300">
              Create signals, get them approved, and browse approved signals from the community.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/trade-signals" className="btn-primary">
                Browse signals
              </Link>
              <Link href="/register" className="btn-secondary border-zinc-500 bg-zinc-800/80 text-white hover:bg-zinc-700">
                Sign up
              </Link>
            </div>
          </div>
        </section>

        <section className="container-app py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/trade-signals"
              className="group card overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative h-32 bg-gradient-to-br from-indigo-500/20 to-zinc-100">
                <img
                  src="/signals-chart.png"
                  alt=""
                  className="h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-zinc-900">Signals</h2>
                <p className="mt-1 text-sm text-zinc-500">Browse approved trade setups from the community</p>
              </div>
            </Link>
            <Link
              href="/discussions"
              className="group card overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative h-32 bg-gradient-to-br from-emerald-500/20 to-zinc-100">
                <img
                  src="/discussions-chart.png"
                  alt=""
                  className="h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-zinc-900">Discussions</h2>
                <p className="mt-1 text-sm text-zinc-500">Join the conversation with other traders</p>
              </div>
            </Link>
            <Link
              href="/register"
              className="group card overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative h-32 bg-gradient-to-br from-amber-500/20 to-zinc-100">
                <img
                  src="/signals-chart.png"
                  alt=""
                  className="h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-zinc-900">Get started</h2>
                <p className="mt-1 text-sm text-zinc-500">Create an account and share your signals</p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
