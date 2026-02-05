import React from 'react';

const spinnerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px',
};

const dotStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  border: '3px solid #ddd',
  borderTop: '3px solid #1976d2',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

export function LoadingSpinner() {
  return (
    <div style={spinnerStyle}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={dotStyle} />
    </div>
  );
}
