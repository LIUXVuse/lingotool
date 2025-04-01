#!/bin/bash

# 設定顏色代碼
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # 重置顏色

echo -e "${YELLOW}開始部署網頁翻譯工具到 Cloudflare Pages...${NC}"

# 安裝依賴
echo -e "${GREEN}安裝依賴...${NC}"
npm install

# 構建應用
echo -e "${GREEN}構建應用...${NC}"
npm run build

# 如果 build 文件夾存在
if [ -d "dist" ]; then
  # 部署到 Cloudflare Pages
  echo -e "${GREEN}部署到 Cloudflare Pages...${NC}"
  npx wrangler pages publish dist --project-name webtranslate
  
  echo -e "${GREEN}部署完成！${NC}"
  echo -e "${YELLOW}您的應用已部署到 https://webtranslate.pages.dev${NC}"
else
  echo -e "${RED}錯誤：dist 文件夾不存在。構建可能失敗。${NC}"
  exit 1
fi 