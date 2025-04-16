import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

const PLAYLISTS_KEY = 'musicdj_playlists';

function Playlist({ allTracks, onSelectTrack, currentTrackId }) {
  const { state, dispatch } = usePlayer();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [addingTrackId, setAddingTrackId] = useState('');
  const [editing, setEditing] = useState(null); // playlist name being edited
  const [editName, setEditName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Load playlists from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(PLAYLISTS_KEY);
    if (stored) setPlaylists(JSON.parse(stored));
  }, []);

  // Save playlists to localStorage
  useEffect(() => {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }, [playlists]);

  // Create a new playlist
  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    if (playlists.find(p => p.name === newPlaylistName.trim())) {
      alert('Playlist name already exists.');
      return;
    }
    setPlaylists([...playlists, { name: newPlaylistName.trim(), tracks: [] }]);
    setNewPlaylistName('');
  };

  // Delete a playlist
  const deletePlaylist = (name) => {
    setPlaylists(playlists.filter(p => p.name !== name));
    if (selectedPlaylist === name) setSelectedPlaylist(null);
  };

  // Rename a playlist
  const renamePlaylist = (oldName, newName) => {
    if (!newName.trim() || playlists.find(p => p.name === newName.trim())) return;
    setPlaylists(playlists.map(p => p.name === oldName ? { ...p, name: newName.trim() } : p));
    if (selectedPlaylist === oldName) setSelectedPlaylist(newName.trim());
  };

  // Start editing
  const startEdit = (name) => {
    setEditing(name);
    setEditName(name);
  };

  // Save edit
  const saveEdit = (name) => {
    if (!editName.trim()) return;
    const newPlaylists = playlists.map(p => p.name === name ? { ...p, name: editName } : p);
    setPlaylists(newPlaylists);
    setEditing(null);
    setEditName('');
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditing(null);
    setEditName('');
  };

  // Add a track to the selected playlist
  const addTrackToPlaylist = (trackId) => {
    if (!selectedPlaylist) return;
    setPlaylists(playlists.map(pl => pl.name === selectedPlaylist
      ? { ...pl, tracks: pl.tracks.includes(trackId) ? pl.tracks : [...pl.tracks, trackId] }
      : pl
    ));
    setAddingTrackId('');
  };

  // Remove a track from the selected playlist
  const removeTrackFromPlaylist = (trackId) => {
    if (!selectedPlaylist) return;
    setPlaylists(playlists.map(pl => pl.name === selectedPlaylist
      ? { ...pl, tracks: pl.tracks.filter(id => id !== trackId) }
      : pl
    ));
  };

  // Get tracks for the selected playlist
  const playlistTracks = selectedPlaylist
    ? playlists.find(pl => pl.name === selectedPlaylist)?.tracks || []
    : [];

  // Drag and drop handlers
  const onDragStart = idx => setDraggedIndex(idx);
  const onDragOver = idx => e => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === idx) return;
    const playlists = [...playlists];
    const [removed] = playlists.splice(draggedIndex, 1);
    playlists.splice(idx, 0, removed);
    setPlaylists(playlists);
    setDraggedIndex(idx);
  };
  const onDragEnd = () => setDraggedIndex(null);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', marginTop: 24, background: '#f5f7fa', borderRadius: 10, boxShadow: '0 2px 8px #e0e0e0', padding: 20 }}>
      <h2 style={{ marginBottom: 14 }}>Playlists</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input
          type="text"
          value={newPlaylistName}
          onChange={e => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name"
          style={{ borderRadius: 6, border: '1.2px solid #b0b0b0', padding: '2px 8px', fontSize: 13 }}
        />
        <button onClick={createPlaylist} style={{ borderRadius: 6, background: '#b0e6b0', color: '#1c5', fontWeight: 700, padding: '2px 10px', border: '1.2px solid #b0b0b0' }}>Create</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {playlists.map((pl, idx) => (
          <li key={pl.name} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            {editing === pl.name ? (
              <>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={{ flex: 1, marginRight: 8, padding: 4 }}
                  aria-label="Edit playlist name"
                />
                <button onClick={() => saveEdit(pl.name)} style={{ marginRight: 4 }}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setSelectedPlaylist(pl.name)} style={{ fontWeight: selectedPlaylist === pl.name ? 700 : 400, background: selectedPlaylist === pl.name ? '#e0e0e0' : '#fff', border: '1px solid #b0b0b0', borderRadius: 5, padding: '2px 8px', flex: 1 }}>{pl.name}</button>
                <button onClick={() => startEdit(pl.name)} aria-label={`Edit playlist ${pl.name}`} style={{ marginRight: 4 }}>Edit</button>
                <button onClick={() => deletePlaylist(pl.name)} style={{ color: '#c00', background: '#fbe3e3', border: '1px solid #b0b0b0', borderRadius: 5, padding: '2px 6px', fontWeight: 700 }}>🗑️</button>
              </>
            )}
            <button onClick={() => onDragStart(idx)} style={{ cursor: 'grab' }} draggable>⋮</button>
          </li>
        ))}
      </ul>
      {playlists.length === 0 && <div style={{ color: '#888', marginTop: 12 }}>No playlists yet.</div>}

      {/* Playlist Tracks Section */}
      {selectedPlaylist && (
        <div style={{ marginTop: 22 }}>
          <h4 style={{ marginBottom: 8 }}>Tracks in "{selectedPlaylist}"</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {playlistTracks.length === 0 && <li style={{ color: '#888' }}>No tracks in this playlist.</li>}
            {playlistTracks.map(trackId => {
              const track = allTracks.find(t => t.id === trackId);
              if (!track) return null;
              return (
                <li key={trackId} style={{ marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ flex: 1 }}>{track.title || track.fileName}</span>
                  <button onClick={() => onSelectTrack(trackId)} style={{ background: '#e0e0e0', border: 'none', borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>Play</button>
                  <button onClick={() => removeTrackFromPlaylist(trackId)} style={{ color: '#c00', background: '#fbe3e3', border: '1px solid #b0b0b0', borderRadius: 4, padding: '2px 6px', fontWeight: 700 }}>Remove</button>
                </li>
              );
            })}
          </ul>

          {/* Add Track to Playlist */}
          <div style={{ marginTop: 14, display: 'flex', gap: 6, alignItems: 'center' }}>
            <select value={addingTrackId} onChange={e => setAddingTrackId(e.target.value)} style={{ borderRadius: 6, border: '1.2px solid #b0b0b0', padding: '2px 8px', fontSize: 13, flex: 1 }}>
              <option value="">Add track...</option>
              {allTracks.filter(t => !playlistTracks.includes(t.id)).map(t => (
                <option key={t.id} value={t.id}>{t.title || t.fileName}</option>
              ))}
            </select>
            <button onClick={() => addTrackToPlaylist(addingTrackId)} disabled={!addingTrackId} style={{ borderRadius: 6, background: '#b0e6b0', color: '#1c5', fontWeight: 700, padding: '2px 10px', border: '1.2px solid #b0b0b0' }}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Playlist;
