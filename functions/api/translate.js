/// <reference types="@cloudflare/workers-types" />
export const onRequest = async (context) => {
    // 只允許 POST 請求
    if (context.request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: '只接受 POST 請求' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    try {
        // 解析請求數據
        const requestData = await context.request.json();
        const { text, sourceLanguage, targetLanguage, userId } = requestData;
        // 驗證必要的參數
        if (!text || !sourceLanguage || !targetLanguage) {
            return new Response(JSON.stringify({
                success: false,
                error: '缺少必要的參數：text, sourceLanguage, targetLanguage',
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        // 記錄請求開始時間（用於計算響應時間）
        const startTime = Date.now();
        // 更新為 DeepSeek API endpoint
        const deepSeekUrl = 'https://api.deepseek.com/chat/completions';
        // 可以簡化 Prompt，讓模型專注翻譯
        const system_prompt = `你是一個專業、精通 ${sourceLanguage} 和 ${targetLanguage} 的翻譯引擎。請將我提供的 ${sourceLanguage} 文本準確翻譯成 ${targetLanguage}。不要輸出任何與翻譯結果無關的內容，例如解釋、評論或標題。直接輸出翻譯後的文本。`;
        const user_prompt = `${text}`; // 直接給文本
        const deepSeekRequestBody = {
            model: 'deepseek-chat', // 使用 DeepSeek 的標準聊天模型
            messages: [
                {
                    role: 'system',
                    content: system_prompt,
                },
                {
                    role: 'user',
                    content: user_prompt,
                },
            ],
            temperature: 0.1, // 保持較低溫度以獲得穩定翻譯
            max_tokens: 2000, // 根據需要調整
            stream: false // 確保一次性返回結果
        };
        // --- 添加詳細日誌 --- 
        const apiKeyExists = !!context.env.DEEPSEEK_API_KEY;
        console.log(`[Translate Function] 發送請求到: ${deepSeekUrl}`);
        console.log(`[Translate Function] 使用模型: ${deepSeekRequestBody.model}`);
        console.log(`[Translate Function] DEEPSEEK_API_KEY 是否存在: ${apiKeyExists}`);
        // 為了安全，不要打印完整的 API Key
        // console.log(`[Translate Function] Key prefix: ${context.env.DEEPSEEK_API_KEY?.substring(0, 5)}...`);
        // 發送請求到 DeepSeek API
        const deepSeekResponse = await fetch(deepSeekUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 使用 DEEPSEEK_API_KEY
                'Authorization': `Bearer ${context.env.DEEPSEEK_API_KEY}`,
                // 移除 OpenRouter 特定標頭
            },
            body: JSON.stringify(deepSeekRequestBody),
        });
        console.log(`[Translate Function] DeepSeek API 響應狀態: ${deepSeekResponse.status}`);
        // 處理 DeepSeek API 響應
        if (!deepSeekResponse.ok) {
            const errorData = await deepSeekResponse.text();
            console.error('DeepSeek API Error Response Body:', errorData);
            try {
                const parsedError = JSON.parse(errorData);
                console.error('Parsed DeepSeek API Error:', parsedError);
                return new Response(JSON.stringify({
                    success: false,
                    error: `DeepSeek API 錯誤: ${deepSeekResponse.status} - ${parsedError?.error?.message || deepSeekResponse.statusText}`,
                }), { status: deepSeekResponse.status, headers: { 'Content-Type': 'application/json' } });
            }
            catch (e) {
                // 如果錯誤響應不是 JSON
                return new Response(JSON.stringify({
                    success: false,
                    error: `DeepSeek API 錯誤: ${deepSeekResponse.status} ${deepSeekResponse.statusText} - ${errorData}`,
                }), { status: deepSeekResponse.status, headers: { 'Content-Type': 'application/json' } });
            }
        }
        // 解析 DeepSeek API 響應
        const responseData = await deepSeekResponse.json();
        const translation = responseData.choices[0]?.message?.content.trim() || '翻譯失敗或無返回內容';
        const responseTime = Date.now() - startTime;
        // 構建成功響應
        return new Response(JSON.stringify({
            success: true,
            translation,
            sourceLanguage,
            targetLanguage,
            metrics: {
                responseTime,
                charCount: text.length,
                userId: userId || 'anonymous',
            },
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    catch (error) {
        console.error('[Translate Function] 內部錯誤:', error);
        return new Response(JSON.stringify({
            success: false,
            error: `處理請求時發生內部錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`,
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};
//# sourceMappingURL=translate.js.map