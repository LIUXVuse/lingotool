# 網頁翻譯工具 (LingoTool)

一個簡單高效的網頁翻譯工具，支持多種語言之間的互譯。基於 React、Vite、Firebase 和 Cloudflare Pages 構建。

## 功能特點

- 支持多種語言之間的互譯
- 簡潔直觀的用戶界面
- 用戶認證（Google 登錄/電子郵件）
- **自定義常用片語管理（需登錄）**
  - **分類管理**：創建、刪除片語類別
  - **片語管理**：在選定類別下新增、刪除片語
  - **即時更新**：所有片語操作即時同步，無需刷新
  - **快速使用**：點擊片語即可將內容填入翻譯框
- 複製和放大顯示翻譯結果
- 語言快速切換功能
- 響應式設計，適用於桌面、平板和移動設備
- 特別適合在醫療場景使用

## 使用指南

### 基本翻譯功能

1. 選擇來源語言和目標語言
2. 在「輸入文本」框中輸入要翻譯的文本
3. 點擊「翻譯」按鈕
4. 在「翻譯結果」框中查看結果
5. 使用「複製」按鈕複製結果
6. 使用「全屏顯示」按鈕將結果放大，方便他人閱讀
7. 使用語言選擇器中間的「↔」按鈕可快速交換來源和目標語言

### 用戶登錄/註冊

1. 點擊頁面右上角的「登入」按鈕
2. 選擇使用 Google 賬號登入或使用電子郵件登入/註冊
3. 登入後，您的用戶名將顯示在頁面右上角
4. 可以通過點擊「登出」按鈕登出

### 自定義片語管理（需登錄）

登入後，左側會顯示「常用片語」區塊。

1.  **管理類別**：
    *   點擊「新增類別」按鈕，輸入名稱並儲存，即可創建新的片語類別。
    *   點擊類別名稱旁邊的「X」按鈕，即可刪除該類別及其下的所有片語。
2.  **管理片語**：
    *   點擊一個類別名稱，選中該類別。
    *   點擊「新增片語」按鈕（在選中類別後出現），輸入片語內容並儲存。
    *   滑鼠懸停在片語上，會出現「X」按鈕，點擊即可刪除該片語。
3.  **使用片語**：
    *   選中一個類別。
    *   點擊該類別下的任意片語，其內容會自動填入「輸入文本」框。
4.  **即時同步**：所有新增、刪除操作都會即時顯示，無需手動刷新頁面。
5.  **場景示例**：醫療人員可以創建「掛號」、「看診」、「領藥」等類別，並在各類別下添加常用語句，方便快速翻譯給不同語言的患者。

## 技術架構

### 前端
- **框架**: React 18 (使用 Vite 作為構建工具)
- **語言**: TypeScript
- **狀態管理**: React Context API (用於認證狀態)
- **路由**: React Router (如果需要多頁面)
- **樣式**: Tailwind CSS (用於快速構建 UI)
- **認證**: Firebase Authentication
- **數據存儲**: Firebase Firestore (用於存儲用戶片語)

### 後端/平台
- **託管**: Cloudflare Pages
- **翻譯 API**: Cloudflare Worker (代理 OpenRouter API 請求)
- **翻譯引擎**: OpenRouter API (例如 DeepSeek, Google Translate 等)

### API 密鑰管理
- **開發環境**: API 密鑰和 Firebase 配置通過根目錄下的 `.env` 文件加載。
- **生產環境**: 在 Cloudflare Pages 環境變數中安全配置 API 密鑰和 Firebase 憑證。
- **前端安全**: 翻譯請求通過 Cloudflare Worker 代理，避免在前端直接暴露 OpenRouter API 密鑰。

## 本地開發

### 前提條件

- Node.js >= 18
- npm >= 9.0
- OpenRouter API 密鑰（從 [openrouter.ai](https://openrouter.ai) 獲取）
- Firebase 項目及配置（用於認證和 Firestore 數據庫）

### 設置步驟

1. 克隆存儲庫：

```bash
git clone https://github.com/LIUXVuse/lingotool.git # 替換為你的倉庫地址
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

然後編輯 `.env` 文件，填入你的 Firebase 配置。注意：OpenRouter API 密鑰現在應該配置在 Cloudflare Worker 或後端代理中，而不是直接放在 `.env` 裡給前端使用。

4. 啟動開發服務器：

```bash
npm run dev
```

5. 訪問本地服務器：

打開瀏覽器，訪問 Vite 提供的本地地址 (通常是 `http://localhost:5173` 或類似地址)。

## 部署到 Cloudflare Pages

### 使用 Wrangler CLI 部署 (推薦)

1. 全局安裝或更新 Wrangler CLI：

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
wrangler pages deploy dist --project-name lingotool # 替換為你的項目名稱
```

### 環境變量配置

在 Cloudflare Pages 項目的設置 (Settings -> Environment variables) 中配置以下 **生產環境** 變量：

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

**注意**: `OPENROUTER_API_KEY` 應該在你的 Cloudflare Worker 或後端代理的環境變量中設置，而不是直接暴露給 Pages 前端。

## 安全性考慮

- **API 密鑰保護**：通過 Cloudflare Worker 或後端代理翻譯請求，保護 OpenRouter API 密鑰。
- **用戶數據**：使用 Firebase Firestore 安全規則限制用戶只能訪問自己的片語數據。
- **HTTPS**：Cloudflare Pages 自動提供 HTTPS 加密傳輸。

## 隱私政策

- **用戶數據**：我們只存儲用戶創建的片語類別和片語內容，不存儲翻譯歷史記錄。
- **分析**：我們不使用任何第三方分析工具追蹤用戶行為。
- **第三方服務**：我們使用 Firebase 進行認證和數據存儲，使用 OpenRouter API (通過代理) 進行翻譯。請參閱它們各自的隱私政策。

## 路線圖

- [x] **實現片語分類管理**
- [x] **實現片語 CRUD 操作及即時同步**
- [ ] 實現文字轉語音功能（使用 Web Speech API）
- [ ] 實現會員訂閱系統 (區分免費/付費用戶的字符限制)
- [ ] 添加離線翻譯功能 (可能使用 PWA 或本地模型)
- [ ] 集成更多翻譯提供商選項
- [ ] 實現翻譯記憶庫功能
- [ ] 添加團隊協作功能

## 貢獻指南

1. Fork 該存儲庫
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 創建 Pull Request

## 許可證

MIT 許可證

**注意**：本項目持續更新中，最近更新日期：2025/4/3。我們歡迎社區貢獻和反饋。






















