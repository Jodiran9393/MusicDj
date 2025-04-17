import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import Toast from '../components/Toast';

function Home() {
  const { state, dispatch } = usePlayer();
  const [playlistName, setPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showPlaylistMenu, setShowPlaylistMenu] = React.useState(null); // track.url or null
  const [allTracks, setAllTracks] = useState([]);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [notif, setNotif] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('musicdj_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Load playlists from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('playlists');
    if (saved) {
      dispatch({ type: 'SET_PLAYLISTS', playlists: JSON.parse(saved) });
    }
  }, [dispatch]);

  // Save playlists to localStorage when they change
  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(state.playlists));
  }, [state.playlists]);

  // Load tracks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('musicdj_tracks');
    if (stored) setAllTracks(JSON.parse(stored));
  }, []);

  // Save tracks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('musicdj_tracks', JSON.stringify(allTracks));
  }, [allTracks]);

  useEffect(() => {
    localStorage.setItem('musicdj_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Show toast helpers
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Filtered tracks based on search and favorites
  const filteredTracks = allTracks.filter(track => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = (
      track.title?.toLowerCase().includes(q) ||
      track.artist?.toLowerCase().includes(q) ||
      track.album?.toLowerCase().includes(q) ||
      track.fileName?.toLowerCase().includes(q)
    );
    const isFavorite = favorites.includes(track.id);
    return matchesSearch && (!showOnlyFavorites || isFavorite);
  });

  const handleRemoveTrack = (trackId) => {
    setAllTracks(tracks => tracks.filter(t => t.id !== trackId));
    dispatch({ type: 'REMOVE_TRACK_FROM_ALL_PLAYLISTS', trackId });
    showToast('Track removed', 'success');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    let skipped = 0;
    files.forEach(file => {
      const fileId = file.name + '_' + file.size;
      if (allTracks.find(t => t.fileId === fileId)) {
        skipped++;
        return;
      }
      const url = URL.createObjectURL(file);
      window.jsmediatags.read(file, {
        onSuccess: tag => {
          setAllTracks(tracks => [
            ...tracks,
            {
              id: url,
              fileId,
              url,
              title: tag.tags.title || file.name,
              artist: tag.tags.artist || '',
              album: tag.tags.album || '',
              fileName: file.name,
              picture: tag.tags.picture ? `data:${tag.tags.picture.format};base64,${btoa(String.fromCharCode(...tag.tags.picture.data))}` : null,
            }
          ]);
        },
        onError: () => {
          setAllTracks(tracks => [
            ...tracks,
            {
              id: url,
              fileId,
              url,
              title: file.name,
              artist: '',
              album: '',
              fileName: file.name,
              picture: null,
            }
          ]);
        }
      });
    });
    if (skipped > 0) {
      setNotif(`${skipped} duplicate file${skipped > 1 ? 's were' : ' was'} skipped.`);
      setTimeout(() => setNotif(''), 3000);
    }
    e.target.value = '';
  };

  const handleTrackClick = (track) => {
    dispatch({ type: 'SET_CURRENT_TRACK', track });
    dispatch({ type: 'SET_PLAYING', isPlaying: true });
    showToast(`Now playing: ${track.title || 'Track'}`, 'info');
  };

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) return;
    const exists = state.playlists.some(p => p.name === playlistName);
    if (exists) return;
    const newPlaylists = [...state.playlists, { name: playlistName, tracks: [] }];
    dispatch({ type: 'SET_PLAYLISTS', playlists: newPlaylists });
    setPlaylistName('');
  };

  const handleSelectPlaylist = (name) => {
    setSelectedPlaylist(name === selectedPlaylist ? null : name);
  };

  const handleAddTrackToPlaylist = (track, playlistName) => {
    const playlists = state.playlists.map(p => {
      if (p.name === playlistName) {
        // Prevent duplicates
        if (!p.tracks) p.tracks = [];
        if (!p.tracks.find(t => t.url === track.url)) {
          return { ...p, tracks: [...p.tracks, track] };
        }
      }
      return p;
    });
    dispatch({ type: 'SET_PLAYLISTS', playlists });
  };

  const handleRemoveTrackFromPlaylist = (track, playlistName) => {
    const playlists = state.playlists.map(p => {
      if (p.name === playlistName) {
        return { ...p, tracks: (p.tracks || []).filter(t => t.url !== track.url) };
      }
      return p;
    });
    dispatch({ type: 'SET_PLAYLISTS', playlists });
  };

  // Toggle favorite for a track
  const toggleFavorite = (trackId) => {
    setFavorites(favs => favs.includes(trackId)
      ? favs.filter(id => id !== trackId)
      : [...favs, trackId]
    );
  };

  // Render search bar and filtered track list
  const renderTrackList = () => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 0 0' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by title, artist, album..."
          style={{
            width: '100%',
            padding: '8px',
            fontSize: 16,
            borderRadius: 8,
            border: '1.2px solid #b0b0b0',
            background: 'var(--container-bg)',
            color: 'var(--text-color)',
          }}
          aria-label="Search tracks"
        />
        <button
          onClick={() => setShowOnlyFavorites(f => !f)}
          aria-pressed={showOnlyFavorites}
          style={{
            background: showOnlyFavorites ? '#ffd700' : 'var(--container-bg)',
            color: showOnlyFavorites ? '#222' : 'var(--text-color)',
            border: '1.2px solid #b0b0b0',
            borderRadius: 7,
            padding: '6px 12px',
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            outline: 'none',
          }}
          title={showOnlyFavorites ? 'Show all tracks' : 'Show favorites only'}
        >
          {showOnlyFavorites ? '★' : '☆'}
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', background: 'var(--container-bg)', borderRadius: 8, boxShadow: '0 1px 4px #eee' }}>
        {filteredTracks.length === 0 && <li style={{ color: 'var(--text-color)', padding: 18, textAlign: 'center' }}>No tracks found.</li>}
        {filteredTracks.map(track => (
          <li key={track.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid #eee', position: 'relative', gap: 12, color: 'var(--text-color)' }}>
            <button
              onClick={() => toggleFavorite(track.id)}
              aria-label={favorites.includes(track.id) ? 'Unfavorite' : 'Favorite'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 22,
                color: favorites.includes(track.id) ? '#ffd700' : '#bbb',
                marginRight: 8,
                transition: 'color 0.2s',
                outline: 'none',
              }}
            >
              {favorites.includes(track.id) ? '★' : '☆'}
            </button>
            {track.picture ? (
              <img src={track.picture} alt="album art" style={{ width: 44, height: 44, borderRadius: 7, objectFit: 'cover', boxShadow: '0 1px 4px #ccc' }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 7, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#888' }}>♪</div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-color)' }}>{track.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-color)' }}>{track.artist} {track.album && <>· {track.album}</>}</div>
            </div>
            <button
              style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, border: 'none', background: '#e57373', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => handleRemoveTrack(track.id)}
              aria-label="Remove track"
            >
              ✕
            </button>
            <button
              style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 4, border: 'none', background: '#00bcd4', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => handleTrackClick(track)}
              aria-label="Play track"
            >
              ▶ Play
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  const renderSelectedPlaylist = () => {
    if (!selectedPlaylist) return null;
    const playlist = state.playlists.find(p => p.name === selectedPlaylist);
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) {
      return <div style={{ color: 'var(--text-color)', marginTop: 12 }}>No tracks in this playlist.</div>;
    }
    return (
      <div style={{ marginTop: 24, background: '#f5f7fa', borderRadius: 10, boxShadow: '0 2px 8px #e0e0e0', padding: 16 }}>
        <h3 style={{ marginBottom: 12, color: 'var(--text-color)' }}>Tracks in {selectedPlaylist}</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {playlist.tracks.map((track, idx) => (
            <li key={track.url} style={{ display: 'flex', alignItems: 'center', marginBottom: 6, padding: 6, borderRadius: 6, background: '#fff', boxShadow: '0 1px 2px #ececec', color: 'var(--text-color)' }}>
              {track.albumArt && <img src={track.albumArt} alt="art" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, marginRight: 8 }} />}
              <span style={{ flex: 1 }}>{track.name} {track.artist && <span style={{ color: '#888', marginLeft: 6 }}>{track.artist}</span>}</span>
              <button style={{ marginLeft: 8 }} onClick={() => handleRemoveTrackFromPlaylist(track, selectedPlaylist)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
      <h1 style={{ color: 'var(--text-color)' }}>Music Library</h1>
      <input
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload-input"
      />
      <label htmlFor="file-upload-input" style={{ display: 'inline-block', background: '#00bcd4', color: '#fff', padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
        + Add Music
      </label>
      {notif && <div style={{ background: '#fffbe7', border: '1px solid #ffe082', borderRadius: 6, padding: '6px 14px', marginTop: 10, fontWeight: 500, color: 'var(--text-color)' }}>{notif}</div>}
      {renderTrackList()}
      <hr />
      <h2 style={{ color: 'var(--text-color)' }}>Playlists</h2>
      <input
        value={playlistName}
        onChange={e => setPlaylistName(e.target.value)}
        placeholder="New playlist name"
        style={{ color: 'var(--text-color)' }}
      />
      <button onClick={handleCreatePlaylist}>Create Playlist</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {state.playlists.map(pl => (
          <li key={pl.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, padding: 8, borderRadius: 6, background: selectedPlaylist === pl.name ? '#e0f7fa' : '#fff', boxShadow: '0 1px 2px #ececec', cursor: 'pointer', fontWeight: selectedPlaylist === pl.name ? 600 : 400, color: 'var(--text-color)' }}
            onClick={() => handleSelectPlaylist(pl.name)}
            tabIndex={0}
            aria-label={`View playlist ${pl.name}`}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelectPlaylist(pl.name); }}
          >
            <span style={{ flex: 1 }}>{pl.name}</span>
            <span style={{ color: '#888', fontSize: 12 }}>{pl.tracks ? pl.tracks.length : 0} tracks</span>
          </li>
        ))}
      </ul>
      {renderSelectedPlaylist()}
    </div>
  );
}

export default Home;
