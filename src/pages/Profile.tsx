import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('登出失敗:', err);
      setError('登出失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">個人資料</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="用戶頭像" 
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">
            {currentUser.displayName || '未設置顯示名稱'}
          </h2>
          <p className="text-gray-600">{currentUser.email}</p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-4">帳戶詳情</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">電子郵件</p>
            <p>{currentUser.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">帳戶創建時間</p>
            <p>{currentUser.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : '未知'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">電子郵件驗證</p>
            <p>{currentUser.emailVerified ? '已驗證' : '未驗證'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">上次登入時間</p>
            <p>{currentUser.metadata.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : '未知'}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition disabled:bg-red-400"
        >
          {isLoading ? '登出中...' : '登出'}
        </button>
      </div>
    </div>
  );
};

export default Profile; 