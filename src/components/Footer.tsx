import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">網頁翻譯工具</h3>
            <p className="text-gray-300 text-sm">
              一個簡單高效的網頁翻譯工具，支持多種語言之間的互譯。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">快速連結</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  首頁
                </Link>
              </li>
              <li>
                <Link to="/translate" className="text-gray-300 hover:text-white">
                  翻譯工具
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  登入
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">
                  註冊
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">關於我們</h3>
            <p className="text-gray-300 text-sm">
              我們致力於提供優質的翻譯服務，幫助用戶打破語言障礙，進行有效的跨語言溝通。
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} 網頁翻譯工具. 保留所有權利.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 