import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Playlist from './Playlist';

describe('Playlist', () => {
  const allTracks = [
    { id: 1, title: 'Song A' },
    { id: 2, title: 'Song B' },
  ];

  it('renders playlist UI', () => {
    const { getByText } = render(<Playlist allTracks={allTracks} onSelectTrack={() => {}} />);
    expect(getByText('Playlist')).toBeInTheDocument();
  });

  it('can create a new playlist', () => {
    const { getByPlaceholderText, getByText } = render(<Playlist allTracks={allTracks} onSelectTrack={() => {}} />);
    fireEvent.change(getByPlaceholderText('New playlist name'), { target: { value: 'MyList' } });
    fireEvent.click(getByText('Create'));
    expect(getByText('MyList')).toBeInTheDocument();
  });

  it('can add a track to playlist', () => {
    const { getByPlaceholderText, getByText, getByRole } = render(<Playlist allTracks={allTracks} onSelectTrack={() => {}} />);
    fireEvent.change(getByPlaceholderText('New playlist name'), { target: { value: 'MyList' } });
    fireEvent.click(getByText('Create'));
    fireEvent.change(getByRole('combobox'), { target: { value: '1' } });
    fireEvent.click(getByText('Add'));
    expect(getByText('Song A')).toBeInTheDocument();
  });

  it('can remove a track from playlist', () => {
    const { getByPlaceholderText, getByText, getByRole, queryByText } = render(<Playlist allTracks={allTracks} onSelectTrack={() => {}} />);
    fireEvent.change(getByPlaceholderText('New playlist name'), { target: { value: 'MyList' } });
    fireEvent.click(getByText('Create'));
    fireEvent.change(getByRole('combobox'), { target: { value: '1' } });
    fireEvent.click(getByText('Add'));
    fireEvent.click(getByText('Remove'));
    expect(queryByText('Song A')).not.toBeInTheDocument();
  });
});
