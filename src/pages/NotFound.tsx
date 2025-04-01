import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">頁面未找到</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        您請求的頁面可能已被移除、名稱已更改或暫時不可用。
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        返回首頁
      </Link>
    </div>
  );
};

export default NotFound; 