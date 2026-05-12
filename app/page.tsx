"use client";

import { useState, useRef } from "react";

// ============================================
// 风格选项配置
// ============================================
const STYLES = [
  { value: "ecommerce", label: "🛒 电商促销", desc: "大胆鲜艳，商业广告风格" },
  { value: "minimalist", label: "🎨 极简艺术", desc: "留白优雅，现代简约设计" },
  { value: "cyberpunk", label: "🌆 赛博朋克", desc: "霓虹灯光，未来科幻氛围" },
  { value: "vintage", label: "📜 复古怀旧", desc: "经典复古，温暖怀旧色调" },
  { value: "nature", label: "🌿 自然清新", desc: "有机形态，绿色生态美学" },
  { value: "tech", label: "💻 科技创新", desc: "渐变网格，前沿科技感" },
];

// 示例主题
const EXAMPLE_THEMES = [
  "双十一全球狂欢节",
  "春季新品发布会",
  "夏日清凉特惠",
  "人工智能科技峰会",
  "绿色环保公益行动",
  "年度音乐节",
];

export default function Home() {
  // 状态管理
  const [theme, setTheme] = useState("");
  const [style, setStyle] = useState("ecommerce");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  /**
   * 生成海报
   */
  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError("请输入海报主题");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setImageUrl(null);
    setPrompt(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: theme.trim(),
          style: style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成失败，请稍后重试");
      }

      setImageUrl(data.imageUrl);
      setPrompt(data.prompt);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "网络错误，请检查连接后重试";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * 下载图片
   */
  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `poster-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // 如果跨域下载失败，直接打开新窗口
      window.open(imageUrl, "_blank");
    }
  };

  /**
   * 使用示例主题
   */
  const handleExampleClick = (example: string) => {
    setTheme(example);
    setError(null);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/60 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI 驱动 · 秒级生成
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            EasyPoster
          </h1>
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto">
            输入你的创意主题，AI 为你生成专业级海报
          </p>
        </header>

        {/* 主内容区 */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 左侧：控制面板 */}
          <div className="space-y-6">
            {/* 主题输入 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <label className="block text-sm font-medium text-white/70 mb-3">
                📝 海报主题
              </label>
              <textarea
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value);
                  setError(null);
                }}
                placeholder="描述你想要的海报内容，例如：双十一全球狂欢节，全场五折起..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none transition-all"
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-white/30">
                  {theme.length}/200
                </span>
                {error && (
                  <span className="text-xs text-red-400">{error}</span>
                )}
              </div>

              {/* 示例主题 */}
              <div className="mt-4">
                <p className="text-xs text-white/30 mb-2">试试这些主题：</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_THEMES.map((example) => (
                    <button
                      key={example}
                      onClick={() => handleExampleClick(example)}
                      className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-white/50 hover:bg-white/10 hover:text-white/70 transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 风格选择 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <label className="block text-sm font-medium text-white/70 mb-3">
                🎨 海报风格
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      style === s.value
                        ? "bg-purple-500/20 border-purple-500/50 text-white"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs mt-1 opacity-60">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !theme.trim()}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all relative overflow-hidden ${
                isGenerating || !theme.trim()
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-[0.98]"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  生成中，请稍候...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  ✨ 生成海报
                </span>
              )}
            </button>
          </div>

          {/* 右侧：预览区域 */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-white/70">
                  🖼️ 生成预览
                </h2>
                {imageUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm hover:bg-green-500/30 transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    下载图片
                  </button>
                )}
              </div>

              {/* 图片展示区 */}
              <div className="flex-1 flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center animate-pulse">
                      <svg
                        className="w-10 h-10 text-purple-400 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">AI 正在创作中...</p>
                      <p className="text-white/30 text-xs mt-1">
                        通常需要 15-30 秒
                      </p>
                    </div>
                  </div>
                ) : imageUrl ? (
                  <div className="w-full flex flex-col items-center gap-4">
                    <div className="relative w-full max-w-sm">
                      <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="生成的海报"
                        className="w-full rounded-xl shadow-2xl shadow-purple-500/10 border border-white/10"
                      />
                    </div>
                    {prompt && (
                      <details className="w-full max-w-sm">
                        <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50 transition-colors">
                          查看 Prompt 详情
                        </summary>
                        <p className="mt-2 text-xs text-white/20 bg-white/5 p-3 rounded-lg">
                          {prompt}
                        </p>
                      </details>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-white/20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/40 text-sm">
                        输入主题并点击生成
                      </p>
                      <p className="text-white/20 text-xs mt-1">
                        海报将在此处展示
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 sm:mt-16 pb-8">
          <p className="text-white/20 text-sm">
            EasyPoster · Powered by AI · Built with Next.js
          </p>
        </footer>
      </div>
    </main>
  );
}
