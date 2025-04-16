import React, { useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

function Player() {
  const { state, dispatch } = usePlayer();
  const audioRef = useRef(null);

  useEffect(() => {
    if (state.isPlaying && audioRef.current) {
      audioRef.current.play();
    } else if (!state.isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [state.isPlaying, state.currentTrack]);

  const play = () => {
    audioRef.current?.play();
    dispatch({ type: 'SET_PLAYING', isPlaying: true });
  };
  const pause = () => {
    audioRef.current?.pause();
    dispatch({ type: 'SET_PLAYING', isPlaying: false });
  };
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
    dispatch({ type: 'SET_PLAYING', isPlaying: false });
  };

  // Shuffle/Repeat controls
  const toggleShuffle = () => {
    dispatch({ type: 'SET_SHUFFLE', shuffle: !state.shuffle });
  };
  const cycleRepeat = () => {
    const next = state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
    dispatch({ type: 'SET_REPEAT', repeat: next });
  };

  // Next/Previous logic
  const playNext = () => {
    const tracks = state.tracks;
    if (!tracks.length) return;
    let idx = tracks.findIndex(t => t === state.currentTrack);
    if (state.shuffle && state.shuffledOrder.length) {
      const curShuffledIdx = state.shuffledOrder.indexOf(idx);
      const nextShuffledIdx = (curShuffledIdx + 1) % state.shuffledOrder.length;
      idx = state.shuffledOrder[nextShuffledIdx];
    } else {
      idx = (idx + 1) % tracks.length;
    }
    if (idx === 0 && state.repeat === 'off') return stop();
    dispatch({ type: 'SET_CURRENT_TRACK', track: tracks[idx] });
    dispatch({ type: 'SET_PLAYING', isPlaying: true });
  };
  const playPrev = () => {
    const tracks = state.tracks;
    if (!tracks.length) return;
    let idx = tracks.findIndex(t => t === state.currentTrack);
    if (state.shuffle && state.shuffledOrder.length) {
      const curShuffledIdx = state.shuffledOrder.indexOf(idx);
      const prevShuffledIdx = (curShuffledIdx - 1 + state.shuffledOrder.length) % state.shuffledOrder.length;
      idx = state.shuffledOrder[prevShuffledIdx];
    } else {
      idx = (idx - 1 + tracks.length) % tracks.length;
    }
    dispatch({ type: 'SET_CURRENT_TRACK', track: tracks[idx] });
    dispatch({ type: 'SET_PLAYING', isPlaying: true });
  };

  const { currentTrack } = state;

  // Button style helpers
  const baseBtn = {
    padding: '8px 16px',
    margin: '0 4px',
    border: 'none',
    borderRadius: 6,
    background: '#00bcd4',
    color: '#fff',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s',
    outline: 'none',
  };
  const activeBtn = {
    ...baseBtn,
    background: '#008fa3',
    fontWeight: 700,
    boxShadow: '0 0 0 2px #00bcd4',
  };
  const disabledBtn = {
    ...baseBtn,
    background: '#bdbdbd',
    color: '#eee',
    cursor: 'not-allowed',
  };

  return (
    <div className="player" style={{ marginTop: 16, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', background: '#fafbfc', borderRadius: 10, boxShadow: '0 2px 8px #e0e0e0', padding: 24 }}>
      <h2 style={{ marginBottom: 18 }}>Now Playing</h2>
      {currentTrack ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            {currentTrack.albumArt && (
              <img src={currentTrack.albumArt} alt="Album Art" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px #b2ebf2' }} />
            )}
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 18 }}>{currentTrack.name}</div>
              {currentTrack.artist && <div>Artist: {currentTrack.artist}</div>}
              {currentTrack.album && <div>Album: {currentTrack.album}</div>}
            </div>
          </div>
          <audio
            ref={audioRef}
            src={currentTrack.url}
            onEnded={() => {
              if (state.repeat === 'one') {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
              } else {
                playNext();
              }
            }}
            controls
            style={{ width: '100%', marginTop: 8 }}
          />
          <div style={{ marginTop: 8, marginBottom: 8, display: 'flex', justifyContent: 'center', gap: 4 }}>
            <button
              onClick={playPrev}
              style={state.tracks.length > 1 ? baseBtn : disabledBtn}
              aria-label="Previous Track"
              disabled={state.tracks.length < 2}
            >Prev</button>
            <button
              onClick={play}
              style={state.isPlaying ? disabledBtn : baseBtn}
              aria-label="Play"
              disabled={state.isPlaying}
            >Play</button>
            <button
              onClick={pause}
              style={!state.isPlaying ? disabledBtn : baseBtn}
              aria-label="Pause"
              disabled={!state.isPlaying}
            >Pause</button>
            <button
              onClick={stop}
              style={baseBtn}
              aria-label="Stop"
            >Stop</button>
            <button
              onClick={playNext}
              style={state.tracks.length > 1 ? baseBtn : disabledBtn}
              aria-label="Next Track"
              disabled={state.tracks.length < 2}
            >Next</button>
          </div>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button
              onClick={toggleShuffle}
              style={state.shuffle ? activeBtn : baseBtn}
              aria-pressed={state.shuffle}
              aria-label="Shuffle"
            >
              Shuffle {state.shuffle ? 'On' : 'Off'}
            </button>
            <button
              onClick={cycleRepeat}
              style={state.repeat !== 'off' ? activeBtn : baseBtn}
              aria-pressed={state.repeat !== 'off'}
              aria-label={`Repeat: ${state.repeat}`}
            >
              Repeat: {state.repeat}
            </button>
          </div>
        </>
      ) : (
        <div>No track loaded</div>
      )}
    </div>
  );
}

export default Player;
