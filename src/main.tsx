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
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h1 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '20px',
          fontSize: 'var(--font-size-3xl)',
          fontWeight: '700'
        }}>Together Apart</h1>
        <p style={{ 
          color: 'var(--text-secondary)', 
          marginBottom: '20px',
          fontSize: 'var(--font-size-base)'
        }}>Loading your beautiful relationship app...</p>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid var(--accent-primary)',
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
