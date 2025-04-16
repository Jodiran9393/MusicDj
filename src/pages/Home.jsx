import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

function Home() {
  const { state, dispatch } = usePlayer();
  const [playlistName, setPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showPlaylistMenu, setShowPlaylistMenu] = React.useState(null); // track.url or null
  const [allTracks, setAllTracks] = useState([]);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [notif, setNotif] = useState('');

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

  const handleRemoveTrack = (trackId) => {
    setAllTracks(tracks => tracks.filter(t => t.id !== trackId));
    dispatch({ type: 'REMOVE_TRACK_FROM_ALL_PLAYLISTS', trackId });
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

  const renderTrackList = () => (
    <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', background: '#f9f9f9', borderRadius: 8, boxShadow: '0 1px 4px #eee' }}>
      {allTracks.length === 0 && <li style={{ color: '#888', padding: 18, textAlign: 'center' }}>No tracks loaded yet.</li>}
      {allTracks.map(track => (
        <li key={track.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid #eee', position: 'relative', gap: 12 }}>
          {track.picture ? (
            <img src={track.picture} alt="album art" style={{ width: 44, height: 44, borderRadius: 7, objectFit: 'cover', boxShadow: '0 1px 4px #ccc' }} />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: 7, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#bbb' }}>🎵</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
            <div style={{ color: '#666', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.artist || 'Unknown Artist'}</div>
          </div>
          <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>{track.album || ''}</span>
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
  );

  const renderSelectedPlaylist = () => {
    if (!selectedPlaylist) return null;
    const playlist = state.playlists.find(p => p.name === selectedPlaylist);
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) {
      return <div style={{ color: '#888', marginTop: 12 }}>No tracks in this playlist.</div>;
    }
    return (
      <div style={{ marginTop: 24, background: '#f5f7fa', borderRadius: 10, boxShadow: '0 2px 8px #e0e0e0', padding: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Tracks in {selectedPlaylist}</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {playlist.tracks.map((track, idx) => (
            <li key={track.url} style={{ display: 'flex', alignItems: 'center', marginBottom: 6, padding: 6, borderRadius: 6, background: '#fff', boxShadow: '0 1px 2px #ececec' }}>
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
      <h1>Music Library</h1>
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
      {notif && <div style={{ color: '#c62828', background: '#fffbe7', border: '1px solid #ffe082', borderRadius: 6, padding: '6px 14px', marginTop: 10, fontWeight: 500 }}>{notif}</div>}
      {renderTrackList()}
      <hr />
      <h2>Playlists</h2>
      <input
        value={playlistName}
        onChange={e => setPlaylistName(e.target.value)}
        placeholder="New playlist name"
      />
      <button onClick={handleCreatePlaylist}>Create Playlist</button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {state.playlists.map(pl => (
          <li key={pl.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, padding: 8, borderRadius: 6, background: selectedPlaylist === pl.name ? '#e0f7fa' : '#fff', boxShadow: '0 1px 2px #ececec', cursor: 'pointer', fontWeight: selectedPlaylist === pl.name ? 600 : 400 }}
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
