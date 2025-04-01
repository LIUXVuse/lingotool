import './index.css';

// 使用原生 DOM 而不是 React
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  
  if (!root) {
    console.error('找不到 root 元素!');
    return;
  }
  
  // 創建容器
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.backgroundColor = 'white';
  container.style.borderRadius = '8px';
  container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  container.style.marginTop = '40px';
  
  // 創建標題
  const title = document.createElement('h1');
  title.textContent = '網頁翻譯工具';
  title.style.textAlign = 'center';
  title.style.color = '#2563eb';
  container.appendChild(title);
  
  // 創建輸入區域
  const inputSection = document.createElement('div');
  inputSection.style.marginBottom = '20px';
  
  const inputLabel = document.createElement('label');
  inputLabel.textContent = '輸入要翻譯的文本:';
  inputLabel.style.display = 'block';
  inputLabel.style.marginBottom = '8px';
  inputSection.appendChild(inputLabel);
  
  const textArea = document.createElement('textarea');
  textArea.style.width = '100%';
  textArea.style.padding = '8px';
  textArea.style.borderRadius = '4px';
  textArea.style.border = '1px solid #ccc';
  textArea.style.minHeight = '100px';
  inputSection.appendChild(textArea);
  
  container.appendChild(inputSection);
  
  // 創建按鈕區域
  const buttonSection = document.createElement('div');
  buttonSection.style.marginBottom = '20px';
  buttonSection.style.textAlign = 'center';
  
  const translateButton = document.createElement('button');
  translateButton.textContent = '翻譯';
  translateButton.style.backgroundColor = '#2563eb';
  translateButton.style.color = 'white';
  translateButton.style.border = 'none';
  translateButton.style.padding = '10px 20px';
  translateButton.style.borderRadius = '4px';
  translateButton.style.cursor = 'pointer';
  translateButton.style.fontSize = '16px';
  buttonSection.appendChild(translateButton);
  
  container.appendChild(buttonSection);
  
  // 創建結果區域
  const resultSection = document.createElement('div');
  resultSection.style.padding = '15px';
  resultSection.style.backgroundColor = '#f8f8f8';
  resultSection.style.borderRadius = '4px';
  resultSection.style.border = '1px solid #eee';
  
  const resultTitle = document.createElement('h3');
  resultTitle.textContent = '翻譯結果:';
  resultTitle.style.margin = '0 0 10px 0';
  resultSection.appendChild(resultTitle);
  
  const resultContent = document.createElement('p');
  resultContent.textContent = '這裡將顯示翻譯結果';
  resultSection.appendChild(resultContent);
  
  container.appendChild(resultSection);
  
  // 設置按鈕點擊事件
  translateButton.addEventListener('click', function() {
    const text = textArea.value.trim();
    if (text) {
      resultContent.textContent = `已翻譯: ${text}`;
    } else {
      resultContent.textContent = '請先輸入要翻譯的文本';
    }
  });
  
  // 將容器添加到頁面
  root.appendChild(container);
}); 