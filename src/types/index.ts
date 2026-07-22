

export type Song = {
  id: string;
  title: string;
  artist: string | null;
  duration: number | null; 
  fileUrl: string;
  userId: string;
  createdAt: string; 
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
  songs: PlaylistSong[]; 
};

export type Favorite = {
  userId: string;
  songId: string;
  createdAt: string;
  song: Song; 
};

export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};


export type ApiSuccess<T> = { status: 'success'; data: T };
export type ApiFail = { status: 'fail'; message: string };