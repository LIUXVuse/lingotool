@echo off
echo 正在構建項目...
call npm run build

echo 正在部署到 Cloudflare Pages...
call npx wrangler pages deploy dist --project-name lingotool

echo 部署完成！
pause 