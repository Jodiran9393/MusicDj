import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Equalizer from './Equalizer';

describe('Equalizer', () => {
  it('renders with default bands', () => {
    const { getByLabelText } = render(<Equalizer />);
    expect(getByLabelText('60Hz')).toBeInTheDocument();
    expect(getByLabelText('10kHz')).toBeInTheDocument();
  });

  it('updates band value on slider change', () => {
    const { getByLabelText } = render(<Equalizer />);
    const slider = getByLabelText('60Hz');
    fireEvent.change(slider, { target: { value: 5 } });
    expect(slider.value).toBe('5');
  });

  it('saves a user preset', () => {
    const { getByPlaceholderText, getByText } = render(<Equalizer />);
    fireEvent.change(getByPlaceholderText('Preset name'), { target: { value: 'Rock' } });
    fireEvent.click(getByText('Save'));
    expect(getByText('Rock')).toBeInTheDocument();
  });

  it('deletes a user preset', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<Equalizer />);
    fireEvent.change(getByPlaceholderText('Preset name'), { target: { value: 'Jazz' } });
    fireEvent.click(getByText('Save'));
    fireEvent.click(getByText('Delete'));
    expect(queryByText('Jazz')).not.toBeInTheDocument();
  });
});
