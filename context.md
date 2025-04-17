# MusicDJ — Context

## Overview
MusicDJ is a modern, visually appealing web-based music player app built with React. It allows users to upload and play local audio files (MP3, WAV, etc.), manage playlists, star favorites, and enjoy advanced features such as shuffle, repeat, a custom equalizer, and album art display. The app is fully client-side, responsive, and optimized for both desktop and mobile browsers.

## Features
- **Track Library & Uploads**: Upload, view, and play your local music files.
- **Playlist Management**: Create, rename, reorder (drag-and-drop), and delete playlists. Add/remove tracks and rearrange them visually.
- **Favorites**: Star (favorite) tracks and filter to show only favorites. Favorites persist in browser storage.
- **Playback Controls**: Play, pause, stop, next, previous, shuffle, repeat (track/playlist), and volume control.
- **Custom Progress Bar**: Seek within tracks using an interactive progress bar with real-time updates.
- **Equalizer**: Adjustable frequency bands with animated sliders, presets, user-defined profiles, and a metallic, touch-friendly UI.
- **Album Art Display**: Extract and show album art from audio metadata or allow manual assignment.
- **Toast Notifications**: Instant feedback for user actions (track added, removed, errors, etc).
- **Keyboard Shortcuts**: Space (play/pause), arrows (track navigation/volume), S (stop), R (repeat), H (shuffle).
- **Responsive Design**: Optimized for desktop and mobile, with a metallic gradient look and compact controls on small screens.
- **Persistent State**: Playlists, favorites, and preferences are saved in browser localStorage.
- **Unit Tests**: Core logic and components are covered by automated tests using Jest and React Testing Library.

## User Experience
- **Home/Library**: Manage all tracks, search/filter, and organize playlists.
- **Now Playing**: Prominent playback controls, album art, and equalizer.
- **Settings**: Equalizer, theme, and preferences (where applicable).
- **Accessibility**: Keyboard navigation and screen reader support are considered.
- **Notifications**: Toasts provide immediate feedback for user actions.

## Technical Stack
- **Frontend Framework**: React (hooks and context for state management).
- **Audio Playback**: HTML5 `<audio>` element and Web Audio API (for equalizer and advanced features).
- **State Persistence**: Browser localStorage for playlists, favorites, and settings.
- **Metadata Parsing**: jsmediatags or similar library for extracting ID3 tags and album art.
- **Styling**: CSS with custom properties for theming and metallic gradients; responsive design for all devices.
- **Testing**: Jest and React Testing Library for unit and component tests.

## File/Directory Structure
- `public/` — Static files (favicon, manifest, etc.)
- `src/`
  - `components/` — UI components (Player, Playlist, Equalizer, Toast, etc.)
  - `context/` — React context for state management
  - `pages/` — Main pages (Home, NowPlaying)
  - `utils/` — Utility functions (audio metadata, storage helpers, etc.)
  - `index.css` — Global styles
  - `App.jsx` — App entry point
- `README.md` — Project overview and usage
- context.md — Project context and technical documentation
- `package.json` — Dependencies and scripts

## Design Notes
- **No server required**: All features run fully client-side in the browser.
- **Extensible**: Modular architecture for easy addition of new features (visualizations, tag editing, etc.).
- **Professional & Academic Quality**: Comprehensive unit tests, code comments, and documentation.

## Goals
- Deliver a beautiful, responsive, and intuitive music player experience in the browser.
- Enable users to manage and enjoy their local music library with advanced playback features.
- Demonstrate best practices in React development, UI/UX, and testing for academic and professional review.

---

*For further details or implementation steps, see the README or code comments.*
