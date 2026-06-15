import { PlayerProvider } from '@/context/player-context';
import { Sidebar } from '@/components/layout/Sidebar';
import { AudioPlayer } from '@/components/player/AudioPlayer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlayerProvider>
      <div className="flex h-screen overflow-hidden bg-zinc-950">
        <Sidebar />
        {/* pb-28 leaves room so content never hides behind the player bar */}
        <main className="flex-1 overflow-y-auto px-6 py-6 pb-28">
          {children}
        </main>
      </div>
      <AudioPlayer />
    </PlayerProvider>
  );
}
