import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App.tsx'
import './index.css'

// Error boundary for better debugging
const Root = () => {
  try {
    return <App />
  } catch (error) {
    console.error('App failed to load:', error)
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
        <p style={{ color: '#6B7380', marginBottom: '20px' }}>Loading your beautiful relationship app...</p>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #5B8CFF',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
