import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 2500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  let bg = '#232';
  if (type === 'success') bg = '#3cb371';
  if (type === 'error') bg = '#c62828';
  if (type === 'info') bg = 'var(--primary)';

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 32,
        transform: 'translateX(-50%)',
        background: bg,
        color: '#fff',
        borderRadius: 8,
        padding: '12px 28px',
        fontWeight: 600,
        fontSize: 16,
        boxShadow: '0 2px 16px #2228',
        zIndex: 9999,
        minWidth: 220,
        textAlign: 'center',
        opacity: 0.97,
        letterSpacing: 0.2,
      }}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
