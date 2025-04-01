import * as React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#2563eb'
      }}>網頁翻譯工具</h1>
      
      <div style={{
        maxWidth: '48rem',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '1.5rem'
      }}>
        <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
          歡迎使用網頁翻譯工具！這個工具可以幫助您將文本從一種語言翻譯成另一種語言。
        </p>
        
        <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
          我們支持 120+ 種語言之間的互譯，非常適合用於旅行、學習和跨文化交流。
        </p>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer'
          }}>
            開始使用
          </button>
        </div>
      </div>
    </div>
  );
}

export default App; 