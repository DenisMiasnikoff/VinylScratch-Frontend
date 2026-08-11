# 🎵 VinylScratch — Frontend

A clean, fast music library web app. Add songs, build playlists, keep your favorites, and listen through a persistent audio player that keeps playing as you move around the app.

**Live demo:** https://vinylscratch-frontend.netlify.app  
**Backend repo:** https://github.com/DenisMiasnikoff/VinylScratch-Backend

> ⏱️ The backend runs on a free tier and sleeps after inactivity — the first request may take ~50 seconds to wake it up. After that it's instant.



---

## Features

- **Persistent audio player** — play/pause, seek, volume, previous/next, and auto-advance through a queue. Playback continues uninterrupted while navigating between pages.
- **Keyboard shortcuts** — space to play/pause, arrow keys to seek, shift + arrows to skip tracks.
- **Song library** — add songs by URL, delete, and play any track with the rest of the library queued behind it. Track duration is read live from the audio metadata.
- **Playlists** — create, delete, add/remove songs, and play an entire playlist.
- **Favorites** — one-tap favoriting with optimistic updates that sync across every page.
- **Authentication** — register and log in with secure httpOnly-cookie JWT sessions.
- **Automated E2E Testing** — 31 Playwright end-to-end tests covering auth, navigation, song library, playlists, and favorites, running automatically on every push via GitHub Actions CI.
- **Responsive** — works on desktop and mobile, with a slide-in navigation drawer on small screens.
- **Polished states** — skeleton loaders, empty states, and error states with retry on every data view.

## Tech stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Playwright** (End-to-End Testing)
- **GitHub Actions** (CI Pipeline)
- **Axios** for API calls

## Architecture highlights

A few decisions worth calling out:

- **Global player as React context.** A single `<audio>` element lives in a `PlayerProvider` above all routes, so navigating between pages never interrupts playback. Any component triggers playback through a small action API (`playSong`, `togglePlay`, `next`, `seek`, …).
- **Derived over stored state.** The "current song" is derived from the queue position rather than duplicated into its own state, and playback metadata (duration, progress) is driven by the audio element's own events — eliminating a class of sync bugs.
- **Typed API layer.** Every request goes through a single typed module that unwraps the backend's `{ status, data }` envelope and normalizes errors, so pages work with clean data and catchable failures.
- **Optimistic UI.** Favoriting, deleting, and playlist edits update the interface immediately and roll back on failure, so the app feels instant.
- **CI/CD Test Automation.** End-to-end flows are fully guarded by Playwright tests running headlessly in GitHub Actions workflows to catch regression bugs before production deployment.

## Project structure

src/
├── app/               # login + register (auth) & dashboard routes
├── components/        # layout, player, songs, playlists, ui
├── context/           # global player state
├── hooks/             # custom hooks (useFavorites)
├── lib/               # axios instance, typed API, helpers
└── types/             # shared TypeScript types
tests/
├── auth.spec.ts       # authentication flow tests
├── favorites.spec.ts  # favorite add/remove tests
├── navigation.spec.ts # sidebar & routing tests
├── playlists.spec.ts  # playlist CRUD tests
└── songs.spec.ts      # song playback & library management tests


## Running locally

You'll need the [backend](https://github.com/DenisMiasnikoff/VinylScratch-Backend) running first.

```bash
# 1. Install dependencies
npm install

# 2. Point the frontend at your API
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1" > .env.local

# 3. Start the dev server
npm run dev

Open http://localhost:3000.

# Run Playwright tests headlessly
npx playwright test

# Open Playwright UI mode for interactive test debugging
npx playwright test --ui

A note on audio files

VinylScratch stores a URL to each audio file rather than hosting the file itself. To test playback, add a song with any direct link to an audio file (e.g. an MP3 URL).

 Public sample tracks from SoundHelix work well and are built into the "Add song" form as quick-fill options.


Deployment

Deployed on Netlify. The only required environment variable is NEXT_PUBLIC_API_URL, pointing at the deployed backend. Continuous integration automatically triggers Playwright E2E suites via GitHub Actions on push.

Built by Denis Miasnikov.