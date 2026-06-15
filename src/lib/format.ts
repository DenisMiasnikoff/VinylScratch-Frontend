// Formats a number of seconds as m:ss (e.g. 73 -> "1:13").
// Returns "0:00" for null/NaN/Infinity so the UI never shows junk.
export function formatTime(seconds: number | null | undefined): string {
  if (seconds == null || !isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
 