import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple test component
const TestApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Inter, sans-serif',
      background: '#F8FAFF',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ color: '#0A0D14', marginBottom: '20px' }}>Together Apart</h1>
      <p style={{ color: '#6B7380' }}>React is working! 🎉</p>
      <button 
        style={{ 
          marginTop: '20px',
          padding: '12px 24px',
          background: '#5B8CFF',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button works!')}
      >
        Test Button
      </button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)
