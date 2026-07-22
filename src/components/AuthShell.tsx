import Link from 'next/link';


export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10">
      <div className="w-full max-w-sm">
       
        <div className="mb-8 flex flex-col items-center text-center">
          <Vinyl />
          <Link
            href="/"
            className="mt-5 flex items-center gap-2 text-2xl font-bold tracking-tight text-white"
          >
            <span className="text-violet-500">♫</span> VinylScratch
          </Link>
          <p className="mt-1.5 text-sm text-zinc-400">{subtitle}</p>
        </div>

        
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl shadow-black/40 backdrop-blur">
          <h1 className="sr-only">{title}</h1>
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-zinc-400">{footer}</p>
      </div>
    </main>
  );
}


function Vinyl() {
  return (
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 animate-[spin_6s_linear_infinite] rounded-full bg-[radial-gradient(circle_at_center,#27272a_0%,#18181b_38%,#0c0c0e_39%,#18181b_60%,#0c0c0e_61%,#18181b_100%)] motion-reduce:animate-none">
        
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/5" />
        
        <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600">
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950" />
        </div>
      </div>
    </div>
  );
}
