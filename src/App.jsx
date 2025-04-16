import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { PlayerProvider } from './context/PlayerContext';
import Home from './pages/Home';
import NowPlaying from './pages/NowPlaying';
import Settings from './pages/Settings';
import Player from './components/Player';
import Playlist from './components/Playlist';
import Equalizer from './components/Equalizer';
import AlbumArt from './components/AlbumArt';
import './App.css';

const theme = {
  primary: '#1DB954',
  background: '#181818',
  text: '#fff',
};

function App() {
  const [page, setPage] = useState('home');

  let PageComponent;
  switch (page) {
    case 'home':
      PageComponent = <Home />;
      break;
    case 'nowplaying':
      PageComponent = <NowPlaying />;
      break;
    case 'settings':
      PageComponent = <Settings />;
      break;
    default:
      PageComponent = <Home />;
  }

  return (
    <ThemeProvider theme={theme}>
      <PlayerProvider>
        <div className="app-container">
          <nav className="nav-bar">
            <button onClick={() => setPage('home')}>Home</button>
            <button onClick={() => setPage('nowplaying')}>Now Playing</button>
            <button onClick={() => setPage('settings')}>Settings</button>
          </nav>
          <main>{PageComponent}</main>
          <Player />
          <Playlist />
          <Equalizer />
          <AlbumArt />
        </div>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
