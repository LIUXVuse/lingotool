import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { languages } from '../utils/languages';

interface PhraseCategory {
  id: string;
  name: string;
  phrases: Phrase[];
}

interface Phrase {
  id: string;
  text: string;
  translations: Record<string, string>;
}

const Translate = () => {
  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('中文');
  const [targetLanguage, setTargetLanguage] = useState('英文');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [phraseCategories, setPhraseCategories] = useState<PhraseCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState('');
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const MAX_CHARS = 500; // 免費用戶字符限制
  const MAX_CHARS_PREMIUM = 2000; // 付費用戶字符限制

  // 模擬從數據庫獲取片語類別
  useEffect(() => {
    if (currentUser) {
      // 在實際應用中，這裡應該調用API來獲取用戶的片語類別
      const fetchPhrases = async () => {
        // 模擬API調用
        setTimeout(() => {
          const sampleCategories: PhraseCategory[] = [
            {
              id: '1',
              name: '醫護門診',
              phrases: [
                { id: '1', text: '請插入健保卡', translations: { '越南文': 'Vui lòng chèn thẻ bảo hiểm y tế', '英文': 'Please insert your health insurance card' } },
                { id: '2', text: '請告訴我您的症狀', translations: { '越南文': 'Vui lòng cho tôi biết các triệu chứng của bạn', '英文': 'Please tell me your symptoms' } }
              ]
            },
            {
              id: '2',
              name: '麻醉科',
              phrases: [
                { id: '3', text: '拔管後請深呼吸', translations: { '泰文': 'หลังจากถอดท่อกรุณาหายใจลึก ๆ', '英文': 'Please take deep breaths after extubation' } },
                { id: '4', text: '您感覺疼痛嗎？', translations: { '泰文': 'คุณรู้สึกเจ็บไหม?', '英文': 'Are you feeling pain?' } }
              ]
            }
          ];
          setPhraseCategories(sampleCategories);
        }, 500);
      };
      
      fetchPhrases();
    }
  }, [currentUser]);

  // 處理文本輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setCharCount(text.length);
  };

  // 交換源語言和目標語言
  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    // 如果已經有翻譯結果，也交換輸入和輸出
    if (outputText) {
      setInputText(outputText);
      setOutputText('');
    }
  };

  // 處理翻譯
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('請輸入要翻譯的文本');
      return;
    }

    if (sourceLanguage === targetLanguage) {
      setError('源語言和目標語言不能相同');
      return;
    }

    const maxChars = currentUser?.uid ? MAX_CHARS_PREMIUM : MAX_CHARS;
    if (inputText.length > maxChars) {
      setError(`文本長度超過限制（${maxChars}字符）`);
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          sourceLanguage,
          targetLanguage,
          userId: currentUser?.uid || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '翻譯請求失敗');
      }

      setOutputText(data.translation);
    } catch (err) {
      setError((err as Error).message || '翻譯過程中發生錯誤');
    } finally {
      setIsTranslating(false);
    }
  };

  // 複製翻譯結果
  const handleCopyOutput = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText)
        .then(() => {
          alert('已複製到剪貼板');
        })
        .catch((err) => {
          console.error('複製失敗:', err);
        });
    }
  };

  // 切換全屏顯示
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 選擇片語
  const handleSelectPhrase = (phrase: Phrase) => {
    setInputText(phrase.text);
    setCharCount(phrase.text.length);
    
    // 如果該片語已有目標語言的翻譯，直接顯示
    if (phrase.translations[targetLanguage]) {
      setOutputText(phrase.translations[targetLanguage]);
    } else {
      setOutputText('');
    }
  };

  // 過濾顯示的語言
  const filteredLanguages = languages.filter(lang => 
    lang.toLowerCase().includes(languageFilter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">翻譯工具</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：片語類別（僅登錄用戶可見） */}
        {currentUser && (
          <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">常用片語</h2>
            
            <div className="mb-4">
              <select 
                className="w-full p-2 border rounded"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">選擇類別</option>
                {phraseCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedCategory && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">
                  {phraseCategories.find(c => c.id === selectedCategory)?.name}
                </h3>
                <ul className="space-y-2">
                  {phraseCategories
                    .find(c => c.id === selectedCategory)
                    ?.phrases.map(phrase => (
                      <li 
                        key={phrase.id}
                        onClick={() => handleSelectPhrase(phrase)}
                        className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-blue-50 transition"
                      >
                        {phrase.text}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* 中間：主要翻譯區域 */}
        <div className={`${currentUser ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 gap-4`}>
          {/* 語言選擇區 */}
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">源語言</label>
              <div className="relative">
                <input
                  type="text"
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  placeholder="搜尋語言..."
                  className="w-full p-2 border rounded mb-1"
                />
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {filteredLanguages.map(lang => (
                    <option key={`source-${lang}`} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleSwapLanguages}
              className="p-2 rounded-full hover:bg-gray-100 transition mt-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
            
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">目標語言</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {languages.map(lang => (
                  <option key={`target-${lang}`} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* 輸入和輸出區域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">輸入文本</label>
                <span className={`text-xs ${charCount > (currentUser?.uid ? MAX_CHARS_PREMIUM : MAX_CHARS) ? 'text-red-500' : 'text-gray-500'}`}>
                  {charCount}/{currentUser?.uid ? MAX_CHARS_PREMIUM : MAX_CHARS}
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="請輸入要翻譯的文本..."
                className="w-full h-48 p-3 border rounded focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
              <button
                onClick={handleTranslate}
                disabled={isTranslating || !inputText.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed w-full"
              >
                {isTranslating ? '翻譯中...' : '翻譯'}
              </button>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">翻譯結果</label>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyOutput}
                    disabled={!outputText}
                    className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    複製
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    disabled={!outputText}
                    className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {isFullscreen ? '退出全屏' : '全屏顯示'}
                  </button>
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={outputText}
                  readOnly
                  placeholder="翻譯結果將顯示在這裡..."
                  className="w-full h-48 p-3 border rounded bg-gray-50"
                ></textarea>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 全屏顯示翻譯結果 */}
      {isFullscreen && outputText && (
        <div 
          ref={fullscreenRef}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={toggleFullscreen}
        >
          <div 
            className="max-w-4xl w-full bg-white rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">翻譯結果 ({targetLanguage})</h2>
              <button 
                onClick={toggleFullscreen}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-3xl font-medium text-center p-6 border rounded bg-gray-50">
              {outputText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Translate; 