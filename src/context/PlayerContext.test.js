import { playerReducer } from './PlayerContext';

describe('playerReducer', () => {
  const initialState = {
    tracks: [],
    playlists: [],
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    shuffle: false,
    repeat: 'off',
    shuffledOrder: [],
  };

  it('should set tracks', () => {
    const action = { type: 'SET_TRACKS', tracks: [{ id: 1 }] };
    const state = playerReducer(initialState, action);
    expect(state.tracks).toEqual([{ id: 1 }]);
    expect(state.shuffledOrder).toEqual([]);
  });

  it('should set current track', () => {
    const action = { type: 'SET_CURRENT_TRACK', track: { id: 2 } };
    const state = playerReducer(initialState, action);
    expect(state.currentTrack).toEqual({ id: 2 });
  });

  it('should set playlists', () => {
    const action = { type: 'SET_PLAYLISTS', playlists: [{ name: 'A', tracks: [] }] };
    const state = playerReducer(initialState, action);
    expect(state.playlists).toEqual([{ name: 'A', tracks: [] }]);
  });

  it('should set playing', () => {
    const action = { type: 'SET_PLAYING', isPlaying: true };
    const state = playerReducer(initialState, action);
    expect(state.isPlaying).toBe(true);
  });

  it('should set volume', () => {
    const action = { type: 'SET_VOLUME', volume: 0.5 };
    const state = playerReducer(initialState, action);
    expect(state.volume).toBe(0.5);
  });

  it('should enable shuffle and generate shuffledOrder', () => {
    const tracks = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const stateWithTracks = { ...initialState, tracks };
    const action = { type: 'SET_SHUFFLE', shuffle: true };
    const state = playerReducer(stateWithTracks, action);
    expect(state.shuffle).toBe(true);
    expect(Array.isArray(state.shuffledOrder)).toBe(true);
    expect(state.shuffledOrder.length).toBe(3);
  });

  it('should disable shuffle and clear shuffledOrder', () => {
    const stateWithShuffle = { ...initialState, shuffle: true, shuffledOrder: [0, 2, 1] };
    const action = { type: 'SET_SHUFFLE', shuffle: false };
    const state = playerReducer(stateWithShuffle, action);
    expect(state.shuffle).toBe(false);
    expect(state.shuffledOrder).toEqual([]);
  });

  it('should set repeat', () => {
    const action = { type: 'SET_REPEAT', repeat: 'one' };
    const state = playerReducer(initialState, action);
    expect(state.repeat).toBe('one');
  });

  it('should remove track from all playlists', () => {
    const stateWithPlaylists = {
      ...initialState,
      playlists: [
        { name: 'A', tracks: [1, 2, 3] },
        { name: 'B', tracks: [2, 3, 4] }
      ]
    };
    const action = { type: 'REMOVE_TRACK_FROM_ALL_PLAYLISTS', trackId: 2 };
    const state = playerReducer(stateWithPlaylists, action);
    expect(state.playlists[0].tracks).toEqual([1, 3]);
    expect(state.playlists[1].tracks).toEqual([3, 4]);
  });

  it('should return state for unknown action', () => {
    const action = { type: 'UNKNOWN' };
    const state = playerReducer(initialState, action);
    expect(state).toBe(initialState);
  });
});
