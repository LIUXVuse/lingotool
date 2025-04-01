import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// 簡單的應用組件
const App = () => {
  const [inputText, setInputText] = React.useState('');
  const [translatedText, setTranslatedText] = React.useState('');

  const handleTranslate = () => {
    if (!inputText.trim()) {
      setTranslatedText('請先輸入要翻譯的文本');
      return;
    }
    // 模擬翻譯過程
    setTranslatedText(`已翻譯: ${inputText}`);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '40px'
    }}>
      <h1 style={{ textAlign: 'center', color: '#2563eb' }}>網頁翻譯工具</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>輸入要翻譯的文本:</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            minHeight: '100px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={handleTranslate}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          翻譯
        </button>
      </div>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f8f8f8',
        borderRadius: '4px',
        border: '1px solid #eee'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>翻譯結果:</h3>
        <p>{translatedText || '這裡將顯示翻譯結果'}</p>
      </div>
    </div>
  );
};

// 渲染應用
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('找不到 root 元素!');
} 