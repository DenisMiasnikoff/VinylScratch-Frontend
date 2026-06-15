'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout, getApiError } from '../../lib/api';

const nav = [
  { href: '/songs', label: 'Songs', icon: IconMusic },
  { href: '/playlists', label: 'Playlists', icon: IconList },
  { href: '/favorites', label: 'Favorites', icon: IconHeart },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      // Even if the request fails, send the user to login.
      console.error(getApiError(err));
    } finally {
      router.push('/login');
    }
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
      <Link href="/songs" className="mb-8 flex items-center gap-2 px-2 text-xl font-bold text-white">
        <span className="text-violet-500">♫</span> VinylScratch
      </Link>

      <nav className="flex flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white',
              ].join(' ')}
            >
              <Icon active={active} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
      >
        <IconLogout />
        Log out
      </button>
    </aside>
  );
}

function IconMusic({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden
      className={active ? 'text-violet-400' : ''}>
      <path d="M9 17V5l10-2v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="17" r="3" />
      <circle cx="16" cy="15" r="3" />
    </svg>
  );
}
function IconList({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden
      className={active ? 'text-violet-400' : ''}>
      <path d="M3 6h13M3 12h13M3 18h9M18 12v7M18 12l3 1" />
    </svg>
  );
}
function IconHeart({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden
      className={active ? 'text-violet-400' : ''}>
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
