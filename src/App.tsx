import React from 'react';

export default function App() {
  return (
    <div style={{ 
      backgroundColor: 'black', 
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Venture OS</h1>
      <p style={{ marginTop: '1rem', color: '#888' }}>System Online.</p>
    </div>
  );
}

