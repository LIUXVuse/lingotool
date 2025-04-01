# 網頁翻譯工具 (LingoTool)

一個簡單高效的網頁翻譯工具，支持多種語言之間的互譯。基於 Cloudflare Pages 和 OpenRouter API 構建。

## 功能特點

- 支持多種語言之間的互譯
- 簡潔直觀的用戶界面
- 用戶認證（Google 登錄/電子郵件）
- 自定義常用片語（需登錄）
- 複製和放大顯示翻譯結果
- 語言快速切換功能
- 響應式設計，適用於桌面、平板和移動設備
- 特別適合在醫療場景使用

## 使用指南

### 基本翻譯功能

1. 選擇來源語言和目標語言
2. 在文本框中輸入要翻譯的文本
3. 點擊「翻譯」按鈕
4. 查看翻譯結果
5. 使用「放大顯示」按鈕將結果放大，方便他人閱讀
6. 使用語言選擇器中間的切換按鈕可快速交換來源和目標語言

### 用戶登錄/註冊

1. 點擊頁面右上角的「登入」按鈕
2. 選擇使用 Google 賬號登入或使用電子郵件登入
3. 如果使用電子郵件註冊，請填寫電子郵件地址和密碼
4. 登入後，您的用戶名將顯示在頁面右上角
5. 可以通過點擊「登出」按鈕登出

### 自定義片語功能

1. 登入後，頁面會顯示「常用片語」區塊
2. 點擊「新增片語」按鈕添加新的片語
3. 輸入片語標題（如「插入健保卡」）和片語內容
4. 點擊「儲存」保存片語
5. 保存後，點擊片語即可將內容自動填入翻譯框
6. 使用場景示例：醫療人員可以添加常用的醫療指導語句，快速翻譯給外籍患者

## 技術架構

### 前端
- HTML, CSS 和 JavaScript 實現
- Firebase Authentication 用於用戶認證
- Firebase Firestore 用於存儲用戶片語

### 後端
- Cloudflare Pages 託管
- 翻譯引擎：OpenRouter API (DeepSeek 模型)

## 本地開發

### 前提條件

- Node.js >= 16
- npm >= 8.0
- OpenRouter API 密鑰（從 [openrouter.ai](https://openrouter.ai) 獲取）
- Firebase 項目配置（用於認證和數據存儲）

### 設置步驟

1. 克隆存儲庫：

```bash
git clone https://github.com/LIUXVuse/lingotool.git
cd lingotool
```

2. 安裝依賴：

```bash
npm install
```

3. 創建 `.env` 文件（基於 `.env.example`）並配置環境變量：

```bash
cp .env.example .env
```

然後編輯 `.env` 文件，填入你的 API 密鑰和 Firebase 配置。

4. 啟動開發服務器：

```bash
npm run dev
```

5. 訪問本地服務器：

打開瀏覽器，訪問 `http://localhost:3000`

## 部署到 Cloudflare Pages

### 使用部署腳本

我們提供了一個簡單的部署腳本：

```bash
# 在 Linux/Mac 上
./deploy.sh

# 在 Windows 上
deploy.bat
```

### 使用 Wrangler CLI 部署

1. 安裝 Wrangler CLI：

```bash
npm install -g wrangler
```

2. 登錄到 Cloudflare：

```bash
wrangler login
```

3. 構建項目：

```bash
npm run build
```

4. 部署到 Cloudflare Pages：

```bash
npx wrangler pages deploy dist --project-name lingotool
```

### 環境變量配置

在 Cloudflare Dashboard 中配置以下環境變量：

- `OPENROUTER_API_KEY`：OpenRouter API 密鑰
- `VITE_FIREBASE_API_KEY`：Firebase API 密鑰
- `VITE_FIREBASE_AUTH_DOMAIN`：Firebase 認證域名
- `VITE_FIREBASE_PROJECT_ID`：Firebase 項目 ID
- `VITE_FIREBASE_STORAGE_BUCKET`：Firebase 存儲桶
- `VITE_FIREBASE_MESSAGING_SENDER_ID`：Firebase 消息發送者 ID
- `VITE_FIREBASE_APP_ID`：Firebase 應用 ID

## 安全性考慮

- API 密鑰保護：生產環境中，API 密鑰通過環境變量配置，避免直接寫入前端代碼
- 用戶數據：所有用戶數據都存儲在 Firebase Firestore 中，受 Firebase 安全規則保護
- HTTPS：Cloudflare Pages 自動提供 HTTPS，確保數據傳輸安全

## 隱私政策

- 用戶數據：我們只存儲用戶創建的片語數據，不存儲翻譯歷史記錄
- 分析：我們不使用任何分析工具追蹤用戶行為
- 第三方服務：我們使用 OpenRouter API 進行翻譯，請參閱他們的隱私政策

## 路線圖

- [ ] 實現文字轉語音功能（使用 Web Speech API）
- [ ] 實現會員訂閱系統
- [ ] 添加離線翻譯功能
- [ ] 集成更多翻譯提供商
- [ ] 實現翻譯記憶庫
- [ ] 添加團隊協作功能

## 貢獻指南

1. Fork 該存儲庫
2. 創建功能分支
3. 提交更改
4. 推送到分支
5. 創建 Pull Request

## 許可證

MIT 許可證

**注意**：本項目持續更新中，最近更新日期：2025/4/1。我們歡迎社區貢獻和反饋。






















