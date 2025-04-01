import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      margin: '20px',
      borderRadius: '8px'
    }}>
      <h2>簡易翻譯工具</h2>
      <p>這是一個測試內容</p>
    </div>
  );
}

// 直接使用純 JavaScript 獲取元素並渲染
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  // 如果找不到 root 元素，在 body 中創建一個並渲染
  console.error('找不到 root 元素，創建新元素...');
  const newRoot = document.createElement('div');
  newRoot.id = 'react-root';
  document.body.appendChild(newRoot);
  ReactDOM.createRoot(newRoot).render(<App />);
} 