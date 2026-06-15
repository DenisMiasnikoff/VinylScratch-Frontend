import { AxiosError } from 'axios';
import api from './axios';
import type { Song, Playlist, Favorite, User } from '@/types';

// Pulls a clean message out of the backend's { status:'fail', message } shape.
export function getApiError(err: unknown): string {
  const axiosErr = err as AxiosError<{ message?: string }>;
  return (
    axiosErr.response?.data?.message ||
    axiosErr.message ||
    'Something went wrong. Please try again.'
  );
}

// ---- Auth ----
export async function login(email: string, password: string): Promise<User> {
  const res = await api.post('/auth/login', { email, password });
  return res.data.data.user;
}

export async function signup(
  username: string,
  email: string,
  password: string
): Promise<User> {
  const res = await api.post('/auth/signup', { username, email, password });
  return res.data.data.user;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

// ---- Songs ----
export async function getSongs(): Promise<Song[]> {
  const res = await api.get('/songs');
  return res.data.data.songs;
}

export async function createSong(input: {
  title: string;
  artist?: string;
  fileUrl: string;
  duration?: number;
}): Promise<Song> {
  const res = await api.post('/songs', input);
  return res.data.data.song;
}

export async function deleteSong(id: string): Promise<void> {
  await api.delete(`/songs/${id}`);
}

// ---- Playlists ----
export async function getPlaylists(): Promise<Playlist[]> {
  const res = await api.get('/playlists');
  return res.data.data.playlists;
}

export async function createPlaylist(name: string): Promise<Playlist> {
  const res = await api.post('/playlists', { name });
  return res.data.data.playlist;
}

export async function deletePlaylist(id: string): Promise<void> {
  await api.delete(`/playlists/${id}`);
}

export async function addSongToPlaylist(
  playlistId: string,
  songId: string
): Promise<void> {
  await api.patch(`/playlists/${playlistId}/songs`, { songId });
}

export async function removeSongFromPlaylist(
  playlistId: string,
  songId: string
): Promise<void> {
  await api.delete(`/playlists/${playlistId}/songs/${songId}`);
}

// ---- Favorites ----
export async function getFavorites(): Promise<Favorite[]> {
  const res = await api.get('/favorites');
  return res.data.data.favorites;
}

export async function addFavorite(songId: string): Promise<void> {
  await api.post(`/favorites/${songId}`);
}

export async function removeFavorite(songId: string): Promise<void> {
  await api.delete(`/favorites/${songId}`);
}