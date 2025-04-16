// Placeholder for custom React hooks
import { useState } from 'react';

export function useAudio() {
  const [audio] = useState(new Audio());
  return audio;
}
