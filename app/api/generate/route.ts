import { NextRequest, NextResponse } from "next/server";

// ============================================
// 风格对应的 Prompt 模板映射
// ============================================
const STYLE_PROMPTS: Record<string, string> = {
  ecommerce:
    "E-commerce promotional poster design, bold vibrant colors, large sale typography, discount badges, product showcase layout, festive atmosphere, commercial advertising style, eye-catching graphics, price tags, shopping elements, high contrast",
  minimalist:
    "Minimalist art poster, clean composition, extensive white space, elegant typography, subtle color palette, geometric shapes, sophisticated modern design, Zen-inspired simplicity, refined aesthetics",
  cyberpunk:
    "Cyberpunk style poster, neon lights, futuristic cityscape, holographic elements, dark background with glowing accents, digital rain, sci-fi atmosphere, chrome and metallic textures, dystopian tech aesthetic, vibrant purple and cyan color scheme",
  vintage:
    "Vintage retro poster design, aged paper texture, classic illustration style, warm muted colors, ornate borders, hand-drawn typography, nostalgic atmosphere, Art Deco or Art Nouveau influences",
  nature:
    "Nature-inspired poster, organic shapes, botanical illustrations, earth tone colors, flowing watercolor textures, green foliage elements, serene landscape, eco-friendly and sustainable aesthetic",
  tech:
    "Technology innovation poster, sleek modern design, gradient mesh backgrounds, abstract data visualization, circuit board patterns, blue and white color scheme, futuristic UI elements, clean geometric layout",
};

// 默认风格
const DEFAULT_STYLE = "ecommerce";

// 海报尺寸
const POSTER_SIZE = "1024x1792"; // 竖版海报比例

interface GenerateRequest {
  theme: string;
  style: string;
}

/**
 * 根据主题和风格拼接完整的英文 Prompt
 */
function buildPrompt(theme: string, style: string): string {
  const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS[DEFAULT_STYLE];

  const prompt = `Create a stunning poster about "${theme}". ${stylePrompt}. 
The poster should have a clear visual hierarchy with the main message prominently displayed. 
High resolution, professional graphic design quality, suitable for both digital display and print. 
No watermarks, no text errors, perfect typography and layout.`;

  return prompt;
}

/**
 * POST /api/generate
 * 接收主题和风格，调用 AI 绘图接口，返回图片 URL
 */
export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { theme, style } = body;

    // 参数校验
    if (!theme || typeof theme !== "string" || theme.trim().length === 0) {
      return NextResponse.json(
        { error: "请输入海报主题" },
        { status: 400 }
      );
    }

    if (theme.trim().length > 200) {
      return NextResponse.json(
        { error: "主题描述过长，请控制在200字以内" },
        { status: 400 }
      );
    }

    // 读取环境变量
    const apiKey = process.env.KULAAI_API_KEY;
    const apiBaseUrl = process.env.KULAAI_API_BASE_URL;
    const model = process.env.AI_MODEL || "dall-e-3";

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key 未配置，请在 .env.local 中设置 KULAAI_API_KEY" },
        { status: 500 }
      );
    }

    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: "API 地址未配置，请在 .env.local 中设置 KULAAI_API_BASE_URL" },
        { status: 500 }
      );
    }

    // 拼接 Prompt
    const prompt = buildPrompt(theme.trim(), style || DEFAULT_STYLE);

    console.log(`[Generate] Theme: ${theme}, Style: ${style}`);
    console.log(`[Generate] Prompt: ${prompt}`);

    // 调用 AI 绘图接口（兼容 OpenAI DALL-E 3 API 格式）
    const apiUrl = `${apiBaseUrl}/images/generations`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        n: 1,
        size: POSTER_SIZE,
        quality: "standard",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Generate] API Error:", response.status, errorData);

      const errorMessage =
        errorData?.error?.message ||
        errorData?.message ||
        `AI 接口请求失败 (${response.status})`;

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 解析返回的图片 URL
    const imageUrl =
      data?.data?.[0]?.url ||
      data?.data?.[0]?.b64_json ||
      data?.url ||
      data?.image_url;

    if (!imageUrl) {
      console.error("[Generate] Unexpected response:", data);
      return NextResponse.json(
        { error: "AI 接口返回数据格式异常，未获取到图片" },
        { status: 500 }
      );
    }

    // 如果返回的是 base64 格式，需要特殊处理
    const isBase64 = typeof imageUrl === "string" && imageUrl.startsWith("data:");

    return NextResponse.json({
      success: true,
      imageUrl: isBase64 ? imageUrl : imageUrl,
      prompt: prompt,
      isBase64: isBase64,
    });
  } catch (error: unknown) {
    console.error("[Generate] Server Error:", error);

    const message =
      error instanceof Error ? error.message : "服务器内部错误，请稍后重试";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
