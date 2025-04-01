interface Env {
  OPENROUTER_API_KEY: string;
}

interface TranslateRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  userId?: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const onRequest: PagesFunction<Env> = async (context) => {
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
    const requestData: TranslateRequest = await context.request.json();
    const { text, sourceLanguage, targetLanguage, userId } = requestData;

    // 驗證必要的參數
    if (!text || !sourceLanguage || !targetLanguage) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '缺少必要的參數：text, sourceLanguage, targetLanguage',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // 記錄請求開始時間（用於計算響應時間）
    const startTime = Date.now();

    // 構建 OpenRouter API 請求
    const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
    const prompt = `請將以下${sourceLanguage}文本翻譯成${targetLanguage}，只返回翻譯結果，不要添加任何解釋或備註:
    "${text}"`;

    const openRouterRequestBody = {
      model: 'deepseek/deepseek-chat-v3-0324:free', // 使用免費版 DeepSeek 模型
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // 降低溫度以獲得更確定的翻譯
      max_tokens: 1000, // 調整以適應翻譯需求
    };

    // 發送請求到 OpenRouter API
    const openRouterResponse = await fetch(openRouterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://webtranslate.pages.dev', // 添加應用網址作為來源引用
        'X-Title': 'Web Translate App', // 應用名稱
      },
      body: JSON.stringify(openRouterRequestBody),
    });

    // 處理 OpenRouter API 響應
    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text();
      console.error('OpenRouter API Error:', errorData);
      return new Response(
        JSON.stringify({
          success: false,
          error: `OpenRouter API 錯誤: ${openRouterResponse.status} ${openRouterResponse.statusText}`,
        }),
        {
          status: openRouterResponse.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // 解析 OpenRouter API 響應
    const responseData: OpenRouterResponse = await openRouterResponse.json();
    const translation = responseData.choices[0]?.message?.content.trim() || '翻譯失敗';
    const responseTime = Date.now() - startTime;

    // 構建成功響應
    return new Response(
      JSON.stringify({
        success: true,
        translation,
        sourceLanguage,
        targetLanguage,
        metrics: {
          responseTime,
          charCount: text.length,
          userId: userId || 'anonymous',
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Translation API Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `處理請求時發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}; 