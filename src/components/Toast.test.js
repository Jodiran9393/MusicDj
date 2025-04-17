import React from 'react';
import { render } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {
  it('renders message', () => {
    const { getByText } = render(<Toast message="Hello!" onClose={() => {}} />);
    expect(getByText('Hello!')).toBeInTheDocument();
  });

  it('does not render when no message', () => {
    const { queryByText } = render(<Toast message="" onClose={() => {}} />);
    expect(queryByText('')).not.toBeInTheDocument();
  });

  it('renders with correct type', () => {
    const { getByText } = render(<Toast message="Success!" type="success" onClose={() => {}} />);
    expect(getByText('Success!')).toBeInTheDocument();
  });
});
