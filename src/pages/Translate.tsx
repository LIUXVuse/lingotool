import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { languages } from '../utils/languages';
import { db } from '../utils/firebase';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc, getDocs } from "firebase/firestore";

interface PhraseCategory {
  id: string;
  name: string;
}

interface Phrase {
  id: string;
  text: string;
  categoryId: string;
}

// 為後端響應定義一個類型
interface ApiResponse {
  success: boolean;
  translation?: string;
  error?: string;
  // 可以添加 metrics 等其他可能的字段
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
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | null>(null);
  const [languageFilter, setLanguageFilter] = useState('');
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddPhraseModal, setShowAddPhraseModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newPhraseText, setNewPhraseText] = useState('');
  const [operationStatus, setOperationStatus] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingPhrases, setIsLoadingPhrases] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isSavingPhrase, setIsSavingPhrase] = useState(false);

  const MAX_CHARS = 500;
  const MAX_CHARS_PREMIUM = 2000;

  useEffect(() => {
    if (!currentUser) {
      setPhraseCategories([]);
      setPhrases([]);
      setSelectedCategory(null);
      return;
    }

    setIsLoadingCategories(true);
    const categoriesCol = collection(db, "users", currentUser.uid, "phraseCategories");
    const q = query(categoriesCol);

    const unsubscribeCategories = onSnapshot(q, (querySnapshot) => {
      const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PhraseCategory));
      setPhraseCategories(categoriesData);
      setIsLoadingCategories(false);
      if (selectedCategory && !categoriesData.some(cat => cat.id === selectedCategory.id)) {
          setSelectedCategory(null);
      }
    }, (error) => {
      console.error("Error fetching categories:", error);
      setOperationStatus("讀取片語類別失敗: " + error.message);
      setIsLoadingCategories(false);
    });

    setIsLoadingPhrases(true);
    const phrasesCol = collection(db, "users", currentUser.uid, "phrases");
    const qPhrases = query(phrasesCol);

    const unsubscribePhrases = onSnapshot(qPhrases, (querySnapshot) => {
        const phrasesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Phrase));
        setPhrases(phrasesData);
        setIsLoadingPhrases(false);
    }, (error) => {
        console.error("Error fetching phrases:", error);
        setOperationStatus("讀取片語內容失敗: " + error.message);
        setIsLoadingPhrases(false);
    });

    return () => {
      unsubscribeCategories();
      unsubscribePhrases();
    }
  }, [currentUser]);

  const handleAddCategory = async () => {
    if (!currentUser || !newCategoryName.trim() || isSavingCategory) return;
    setIsSavingCategory(true);
    setOperationStatus("正在儲存類別...");
    try {
      const categoriesCol = collection(db, "users", currentUser.uid, "phraseCategories");
      await addDoc(categoriesCol, { name: newCategoryName.trim() });
      setNewCategoryName('');
      setShowAddCategoryModal(false);
      setOperationStatus("類別已儲存！");
      setTimeout(() => setOperationStatus(null), 2000);
    } catch (error) {
      console.error("Error adding category: ", error);
      setOperationStatus("儲存類別失敗: " + (error as Error).message);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!currentUser || !window.confirm("確定要刪除此類別及其所有片語嗎？")) return;
    setOperationStatus("正在刪除類別...");
    try {
      const categoryDocRef = doc(db, "users", currentUser.uid, "phraseCategories", categoryId);
      await deleteDoc(categoryDocRef);

      const phrasesCol = collection(db, "users", currentUser.uid, "phrases");
      const q = query(phrasesCol, where("categoryId", "==", categoryId));
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
      await Promise.all(deletePromises);

      setOperationStatus("類別及片語已刪除！");
      if (selectedCategory?.id === categoryId) {
          setSelectedCategory(null);
      }
      setTimeout(() => setOperationStatus(null), 2000);
    } catch (error) {
      console.error("Error deleting category: ", error);
      setOperationStatus("刪除類別失敗");
    }
  };

  const handleAddPhrase = async () => {
    if (!currentUser || !selectedCategory || !newPhraseText.trim() || isSavingPhrase) return;
    setIsSavingPhrase(true);
    setOperationStatus("正在儲存片語...");
    try {
      const phrasesCol = collection(db, "users", currentUser.uid, "phrases");
      await addDoc(phrasesCol, {
        text: newPhraseText.trim(),
        categoryId: selectedCategory.id
      });
      setNewPhraseText('');
      setShowAddPhraseModal(false);
      setOperationStatus("片語已儲存！");
      setTimeout(() => setOperationStatus(null), 2000);
    } catch (error) {
      console.error("Error adding phrase: ", error);
      setOperationStatus("儲存片語失敗: " + (error as Error).message);
    } finally {
      setIsSavingPhrase(false);
    }
  };

  const handleDeletePhrase = async (phraseId: string) => {
    if (!currentUser || !window.confirm("確定要刪除此片語嗎？")) return;
    setOperationStatus("正在刪除片語...");
    try {
      const phraseDocRef = doc(db, "users", currentUser.uid, "phrases", phraseId);
      await deleteDoc(phraseDocRef);
      setOperationStatus("片語已刪除！");
      setTimeout(() => setOperationStatus(null), 2000);
    } catch (error) {
      console.error("Error deleting phrase: ", error);
      setOperationStatus("刪除片語失敗");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setCharCount(text.length);
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    if (outputText) {
      setInputText(outputText);
      setOutputText('');
    }
  };

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

      // 為 data 指定類型
      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        // 現在可以安全地訪問 data.error
        throw new Error(data.error || `翻譯請求失敗，狀態碼: ${response.status}`);
      }

      // 現在可以安全地訪問 data.translation
      setOutputText(data.translation || '翻譯結果為空'); // 添加一個空結果的處理
    } catch (err) {
      console.error("翻譯過程中發生錯誤:", err);
      setError((err as Error).message || '翻譯過程中發生錯誤');
    } finally {
      setIsTranslating(false);
    }
  };

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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSelectPhrase = (phrase: Phrase) => {
    setInputText(phrase.text);
    setCharCount(phrase.text.length);
    setOutputText('');
  };

  const filteredLanguages = languages.filter(lang => 
    lang.toLowerCase().includes(languageFilter.toLowerCase())
  );

  const filteredPhrases = selectedCategory
    ? phrases.filter(p => p.categoryId === selectedCategory.id)
    : [];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {operationStatus && (
        <div className={`fixed top-4 right-4 p-3 rounded shadow-lg text-white ${operationStatus.includes('失敗') ? 'bg-red-500' : 'bg-green-500'} z-50`}>
          {operationStatus}
          <button onClick={() => setOperationStatus(null)} className="ml-2 font-bold">X</button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">翻譯工具</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {currentUser && (
          <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">常用片語</h2>
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm disabled:opacity-50"
                disabled={isLoadingCategories || isLoadingPhrases || isSavingCategory}
              >
                新增類別
              </button>
            </div>

            {(isLoadingCategories || isLoadingPhrases) && <p className="text-gray-500 text-sm">正在載入片語資料...</p>}
            {!isLoadingCategories && !isLoadingPhrases && (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                   {phraseCategories.length === 0 && <p className="text-gray-500 text-sm">尚未建立任何類別</p>}
                   {phraseCategories.map(category => (
                     <li
                       key={category.id}
                       className={`p-2 rounded cursor-pointer flex justify-between items-center group ${selectedCategory?.id === category.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                     >
                       <span onClick={() => setSelectedCategory(category)} className="flex-grow mr-2 truncate" title={category.name}>{category.name}</span>
                       <button
                          onClick={(e) => {e.stopPropagation(); handleDeleteCategory(category.id)}}
                          className="text-red-500 hover:text-red-700 text-xs font-bold px-1 flex-shrink-0"
                          title="刪除類別"
                          disabled={isLoadingCategories || isLoadingPhrases}
                       >
                          X
                       </button>
                     </li>
                   ))}
                 </ul>
            )}

            {selectedCategory && !isLoadingPhrases && (
              <div className="border-t pt-4 space-y-2">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700 truncate" title={selectedCategory.name}>{selectedCategory.name}</h3>
                    <button
                      onClick={() => setShowAddPhraseModal(true)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex-shrink-0 disabled:opacity-50"
                      disabled={isLoadingPhrases || isSavingPhrase}
                    >
                      新增片語
                    </button>
                  </div>

                <ul className="space-y-2 max-h-60 overflow-y-auto">
                 {filteredPhrases.length === 0 && <p className="text-gray-500 text-sm">此類別下尚無片語</p>}
                  {filteredPhrases.map(phrase => (
                      <li
                        key={phrase.id}
                        className="p-2 bg-gray-50 rounded hover:bg-blue-50 transition flex justify-between items-center group"
                      >
                         <span onClick={() => handleSelectPhrase(phrase)} className="cursor-pointer flex-grow mr-2 break-all">{phrase.text}</span>
                         <button
                            onClick={(e) => {e.stopPropagation(); handleDeletePhrase(phrase.id)}}
                            className="text-red-400 hover:text-red-600 text-xs font-bold px-1 flex-shrink-0 disabled:opacity-50"
                            title="刪除片語"
                            disabled={isLoadingPhrases}
                         >
                           X
                         </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div className={`${currentUser ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 gap-4`}>
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

      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">新增片語類別</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="輸入類別名稱"
              className="w-full p-2 border rounded mb-4"
              disabled={isSavingCategory}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddCategoryModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" disabled={isSavingCategory}>取消</button>
              <button onClick={handleAddCategory} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50" disabled={isSavingCategory}>
                {isSavingCategory ? '儲存中...' : '儲存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddPhraseModal && selectedCategory && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
             <h3 className="text-lg font-semibold mb-4">在 "{selectedCategory.name}" 下新增片語</h3>
             <textarea
               value={newPhraseText}
               onChange={(e) => setNewPhraseText(e.target.value)}
               placeholder="輸入片語內容"
               rows={4}
               className="w-full p-2 border rounded mb-4"
               disabled={isSavingPhrase}
             />
             <div className="flex justify-end gap-2">
               <button onClick={() => setShowAddPhraseModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" disabled={isSavingPhrase}>取消</button>
               <button onClick={handleAddPhrase} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" disabled={isSavingPhrase}>
                 {isSavingPhrase ? '儲存中...' : '儲存'}
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default Translate; 