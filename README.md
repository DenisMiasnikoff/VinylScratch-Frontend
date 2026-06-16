# 🎵 VinylScratch — Frontend

A clean, fast music library web app. Add songs, build playlists, keep your favorites, and listen through a persistent audio player that keeps playing as you move around the app.

**Live demo:** https://vinylscratch-frontend.netlify.app
**Backend repo:** https://github.com/DenisMiasnikoff/VinylScratch-Backend

> ⏱️ The backend runs on a free tier and sleeps after inactivity — the first request may take ~50 seconds to wake it up. After that it's instant.

![VinylScratch screenshot](./docs/screenshot.png)
<!-- Add a screenshot at docs/screenshot.png — the songs page with a track playing looks best -->

---

## Features

- **Persistent audio player** — play/pause, seek, volume, previous/next, and auto-advance through a queue. Playback continues uninterrupted while navigating between pages.
- **Keyboard shortcuts** — space to play/pause, arrow keys to seek, shift + arrows to skip tracks.
- **Song library** — add songs by URL, delete, and play any track with the rest of the library queued behind it. Track duration is read live from the audio metadata.
- **Playlists** — create, delete, add/remove songs, and play an entire playlist.
- **Favorites** — one-tap favoriting with optimistic updates that sync across every page.
- **Authentication** — register and log in with secure httpOnly-cookie JWT sessions.
- **Responsive** — works on desktop and mobile, with a slide-in navigation drawer on small screens.
- **Polished states** — skeleton loaders, empty states, and error states with retry on every data view.

## Tech stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Axios** for API calls

## Architecture highlights

A few decisions worth calling out:

- **Global player as React context.** A single `<audio>` element lives in a `PlayerProvider` above all routes, so navigating between pages never interrupts playback. Any component triggers playback through a small action API (`playSong`, `togglePlay`, `next`, `seek`, …).
- **Derived over stored state.** The "current song" is derived from the queue position rather than duplicated into its own state, and playback metadata (duration, progress) is driven by the audio element's own events — eliminating a class of sync bugs.
- **Typed API layer.** Every request goes through a single typed module that unwraps the backend's `{ status, data }` envelope and normalizes errors, so pages work with clean data and catchable failures.
- **Optimistic UI.** Favoriting, deleting, and playlist edits update the interface immediately and roll back on failure, so the app feels instant.

## Project structure

```
src/
├── app/
│   ├── (auth)/            # login + register (centered card layout)
│   └── (dashboard)/       # songs, playlists, favorites (sidebar + player layout)
├── components/
│   ├── layout/            # responsive sidebar + shell
│   ├── player/            # persistent audio player bar
│   ├── songs/             # song row, add-song modal
│   ├── playlists/         # playlist card
│   └── ui/                # reusable Input, Button
├── context/               # global player state
├── hooks/                 # useFavorites
├── lib/                   # axios instance, typed API, helpers
└── types/                 # shared TypeScript types
```

## Running locally

You'll need the [backend](https://github.com/DenisMiasnikoff/VinylScratch-Backend) running first.

```bash
# 1. Install dependencies
npm install

# 2. Point the frontend at your API
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1" > .env.local

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:5000/api/v1` |

### A note on audio files

VinylScratch stores a **URL** to each audio file rather than hosting the file itself. To test playback, add a song with any direct link to an audio file (e.g. an MP3 URL). Public sample tracks from [SoundHelix](https://www.soundhelix.com/audio-examples) work well and are built into the "Add song" form as quick-fill options.

## Deployment

Deployed on **Netlify**. The only required environment variable is `NEXT_PUBLIC_API_URL`, pointing at the deployed backend. Because it's a `NEXT_PUBLIC_` variable, it's baked in at build time — changing it requires a fresh deploy.

## Possible future improvements

- File upload (drag-and-drop) backed by cloud storage, replacing the URL field
- Search and filtering across the library
- Drag-to-reorder playlist songs
- Shared/public playlists

---

Built by [Denis Miasnikov](https://github.com/DenisMiasnikoff).
