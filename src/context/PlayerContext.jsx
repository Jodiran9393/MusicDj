import React, { createContext, useReducer, useContext } from 'react';

const PlayerContext = createContext();

const initialState = {
  tracks: [],
  playlists: [],
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  shuffle: false,
  repeat: 'off', // 'off', 'one', 'all'
  shuffledOrder: [],
};

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_TRACKS':
      return { ...state, tracks: action.tracks, shuffledOrder: [] };
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.track };
    case 'SET_PLAYLISTS':
      return { ...state, playlists: action.playlists };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.isPlaying };
    case 'SET_VOLUME':
      return { ...state, volume: action.volume };
    case 'SET_SHUFFLE':
      // Generate a shuffled order if enabling shuffle
      let shuffledOrder = state.shuffledOrder;
      if (action.shuffle && state.tracks.length > 1) {
        shuffledOrder = shuffleArray(state.tracks.map((_, idx) => idx));
      } else if (!action.shuffle) {
        shuffledOrder = [];
      }
      return { ...state, shuffle: action.shuffle, shuffledOrder };
    case 'SET_REPEAT':
      return { ...state, repeat: action.repeat };
    case 'REMOVE_TRACK_FROM_ALL_PLAYLISTS': {
      const trackId = action.trackId;
      // Remove the track from every playlist's tracks array
      const playlists = state.playlists.map(pl =>
        ({ ...pl, tracks: pl.tracks.filter(id => id !== trackId) })
      );
      return { ...state, playlists };
    }
    default:
      return state;
  }
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
