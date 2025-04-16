# Music Player Web App — Context

## Overview
This project is a modern web-based Music Player App that allows users to play local audio files (MP3, WAV, etc.), manage playlists, and enjoy features such as shuffle, repeat, equalizer, and album art display. The app is designed for desktop browsers and leverages web technologies for seamless audio playback and rich user experience.

## Features
- **Play Local Audio Files**: Users can load audio files from their device for playback. Supported formats include MP3, WAV, and others supported by the browser.
- **Playlists**: Create, edit, and manage playlists. Add, remove, and reorder tracks. Playlists persist in browser storage.
- **Playback Controls**: Play, pause, stop, next, previous, seek bar, and volume control.
- **Shuffle & Repeat**: Shuffle playback order; repeat track or playlist.
- **Equalizer**: Adjustable frequency bands (using Web Audio API), with presets and custom profiles.
- **Album Art Display**: Extract and show album art from audio metadata or allow manual assignment.

## User Experience
- **Home/Library**: View and manage all loaded tracks and playlists.
- **Now Playing**: Prominent playback controls and album art.
- **Settings**: Equalizer, theme, and other preferences.

## Technical Stack
- **Frontend Framework**: React (with hooks and context for state management).
- **Audio Playback**: HTML5 `<audio>` element and Web Audio API for advanced features like equalizer.
- **State Persistence**: Browser localStorage or IndexedDB for playlists and settings.
- **Metadata Parsing**: Use jsmediatags or similar library to extract ID3 tags and album art from files.
- **Styling**: CSS Modules or styled-components for modular, themeable UI.
- **Equalizer**: A realistic metallic hue and touch feedback, animated sliders, and compact/mobile adjusments. Let the equalizer have a width: height ratio of 3:1 to improve the look.

## File/Directory Structure (Planned)
- `public/` — Static files (favicon, manifest, etc.)
- `src/`
  - `components/` — React components (Player, Playlist, Equalizer, AlbumArt, etc.)
  - `utils/` — Utility functions (audio metadata, storage helpers, etc.)
  - `hooks/` — Custom React hooks
  - `App.jsx` — Main app entry
  - `index.js` — React DOM bootstrap
- `context.md` — Project context and documentation
- `package.json` — Dependencies and scripts

## Design Notes
- **No server required**: All features run client-side in the browser.
- **Accessibility**: Keyboard navigation and screen reader support are considered.
- **Extensible**: Architecture allows for easy addition of features (e.g., visualizations, tag editing).

## Goals
- Deliver a beautiful, responsive, and intuitive music player experience in the browser.
- Enable users to manage and enjoy their local music library with advanced playback features.

---

*For further details or implementation steps, see the README or code comments.*
