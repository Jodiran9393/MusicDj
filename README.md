# MusicDJ

A modern, visually appealing, and feature-rich music player web app built with React.

## Features

- **Track Library & Uploads:** Upload, view, and play your local music files.
- **Playlist Management:** Create, rename, reorder, and delete playlists. Drag-and-drop to rearrange tracks within playlists.
- **Favorites:** Star your favorite tracks and filter to see only favorites.
- **Search & Filter:** Instantly search tracks by title, artist, album, or filename.
- **Now Playing & Playback Controls:** Play, pause, skip, stop, shuffle, repeat, and seek within tracks using a custom progress bar.
- **Equalizer:** Interactive equalizer with presets and user-defined settings.
- **Responsive Design:** Optimized for desktop and mobile with a metallic gradient UI.
- **Toast Notifications:** Get instant feedback on actions (track added, removed, etc).
- **Keyboard Shortcuts:** Control playback with your keyboard (see below).
- **Persistent State:** Playlists, favorites, and preferences are saved in your browser.
- **Unit Tests:** Core logic and components are covered by automated tests.

## Keyboard Shortcuts

| Shortcut      | Action                |
|--------------|-----------------------|
| Space        | Play/Pause            |
| → / ←        | Next/Previous Track   |
| ↑ / ↓        | Volume Up/Down        |
| S            | Stop                  |
| R            | Cycle Repeat Mode     |
| H            | Toggle Shuffle        |

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Run tests:**
   ```bash
   npm test
   ```

## Project Structure

```
src/
  components/        # UI components (Player, Playlist, Equalizer, Toast, etc)
  context/           # React context for state management
  pages/             # Main pages (Home, NowPlaying)
  utils/             # Utility functions (e.g., Equalizer engine)
  index.css          # Global styles
  App.jsx            # App entry point
```

## Contributing

- Fork this repo and create a feature branch.
- Write clear, well-documented code and tests.
- Open a pull request with a detailed description.

## License
MIT

---

### Academic Notes
- This project demonstrates best practices in React, state management, testing, and responsive UI.
- Unit tests cover reducers, core logic, and key UI interactions.
- The codebase is organized for clarity, scalability, and maintainability.

---

**Enjoy your music with MusicDJ!**
