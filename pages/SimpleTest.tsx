import React from 'react';

const SimpleTest: React.FC = () => {
  console.log('SimpleTest component is rendering!');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333' }}>🎉 Simple Test Page</h1>
      <p style={{ color: '#666' }}>If you can see this, React is working!</p>
      <div style={{ 
        backgroundColor: '#4CAF50', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        margin: '10px 0'
      }}>
        ✅ React is rendering correctly
      </div>
      <div style={{ 
        backgroundColor: '#2196F3', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        margin: '10px 0'
      }}>
        ✅ Vite is serving the app
      </div>
      <div style={{ 
        backgroundColor: '#FF9800', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        margin: '10px 0'
      }}>
        ✅ JavaScript is executing
      </div>
      <button 
        onClick={() => alert('Button click works!')}
        style={{
          backgroundColor: '#9C27B0',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '10px 0'
        }}
      >
        Test Button Click
      </button>
    </div>
  );
};

export default SimpleTest;



