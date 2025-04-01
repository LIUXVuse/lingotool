import { useState } from 'react';

const HealthCheck = () => {
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const checkTranslateApi = async () => {
    setApiStatus('loading');
    addLog('開始測試翻譯 API...');
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: '這是一個測試',
          sourceLanguage: '中文',
          targetLanguage: '英文',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setApiStatus('success');
        setMessage(`API 連接成功: "${data.translation}"`);
        addLog(`翻譯成功! 返回: ${data.translation}`);
        addLog(`響應時間: ${data.metrics?.responseTime}ms`);
      } else {
        setApiStatus('error');
        setMessage(`API 錯誤: ${data.error || '未知錯誤'}`);
        addLog(`API 錯誤: ${data.error || '未知錯誤'}`);
      }
    } catch (err) {
      setApiStatus('error');
      const errorMessage = err instanceof Error ? err.message : '未知錯誤';
      setMessage(`請求失敗: ${errorMessage}`);
      addLog(`請求失敗: ${errorMessage}`);
    }
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">系統健康檢查</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">API 連接測試</h2>
        <div className="flex space-x-4 mb-4">
          <button 
            onClick={checkTranslateApi}
            disabled={apiStatus === 'loading'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            測試翻譯 API
          </button>
          <button 
            onClick={clearLogs}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition"
          >
            清除日誌
          </button>
        </div>
        
        {message && (
          <div className={`p-4 rounded mb-4 ${
            apiStatus === 'success' ? 'bg-green-100 text-green-800' : 
            apiStatus === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {message}
          </div>
        )}
        
        <div className="border rounded p-4 bg-gray-50 h-64 overflow-auto">
          <pre className="text-sm">
            {logs.length === 0 ? '暫無日誌...' : logs.join('\n')}
          </pre>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">系統信息</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border rounded p-3">
            <h3 className="text-sm font-medium text-gray-600">環境</h3>
            <p className="text-lg">{import.meta.env.MODE}</p>
          </div>
          <div className="border rounded p-3">
            <h3 className="text-sm font-medium text-gray-600">API 版本</h3>
            <p className="text-lg">v1.0.0</p>
          </div>
          <div className="border rounded p-3">
            <h3 className="text-sm font-medium text-gray-600">建議最大輸入長度</h3>
            <p className="text-lg">2000 字符</p>
          </div>
          <div className="border rounded p-3">
            <h3 className="text-sm font-medium text-gray-600">支持語言數</h3>
            <p className="text-lg">120+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck; 