// Mirrors the Prisma models + the { status, data } response envelope.

export type Song = {
  id: string;
  title: string;
  artist: string | null;
  duration: number | null; // seconds; often null, read real value from <audio>
  fileUrl: string;
  userId: string;
  createdAt: string; // ISO
};

export type PlaylistSong = {
  playlistId: string;
  songId: string;
  addedAt: string;
  song: Song;
};

export type Playlist = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  songs: PlaylistSong[]; // GET /playlists includes nested songs
};

export type Favorite = {
  userId: string;
  songId: string;
  createdAt: string;
  song: Song; // GET /favorites includes the song
};

export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

// Response envelope used by every endpoint.
export type ApiSuccess<T> = { status: 'success'; data: T };
export type ApiFail = { status: 'fail'; message: string };