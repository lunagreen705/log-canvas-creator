
import { LogCanvas } from "@/components/LogCanvas";
import trpgLogo from "@/assets/trpg-logo.png";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [preloadedContent, setPreloadedContent] = useState<string>("");

  useEffect(() => {
    // 檢查是否有預載的日誌內容
    const encodedData = searchParams.get('data');
    if (encodedData) {
      try {
        const decodedContent = decodeURIComponent(atob(encodedData));
        setPreloadedContent(decodedContent);
      } catch (error) {
        console.error('解析預載日誌內容時發生錯誤:', error);
      }
    }
  }, [searchParams]);
  return (
    <div className="min-h-screen bg-gradient-canvas relative overflow-hidden">
      {/* Mystical background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">⚔️</div>
        <div className="absolute top-20 right-20 text-4xl">🔮</div>
        <div className="absolute bottom-20 left-20 text-5xl">📜</div>
        <div className="absolute bottom-10 right-10 text-4xl">🕯️</div>
        <div className="absolute top-1/3 left-1/4 text-3xl">✦</div>
        <div className="absolute top-2/3 right-1/3 text-3xl">☆</div>
        <div className="absolute top-1/2 left-1/2 text-2xl transform -translate-x-1/2 -translate-y-1/2">⭐</div>
        <div className="absolute top-1/4 right-1/4 text-3xl">🌙</div>
        <div className="absolute bottom-1/3 left-1/3 text-2xl">✧</div>
      </div>
      
      {/* Mystical border pattern */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      {/* Header */}
      <header className="bg-canvas border-b border-canvas-border shadow-soft relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="container mx-auto px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-primary rounded-full opacity-50 blur-sm"></div>
                <img src={trpgLogo} alt="TRPG Logo" className="w-10 h-10 relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
                  <span>🏛️</span>
                  TRPG 神話日誌畫布
                  <span>📖</span>
                </h1>
                <p className="text-sm text-muted-foreground">專業的桌上角色扮演遊戲記錄格式化聖典</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span>✨</span>v2.0<span>✨</span>
              </p>
              <p className="text-xs text-muted-foreground">神祕學重製版</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative">
        <div className="mb-8 text-center relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl opacity-20">⚡</div>
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <span className="text-xl">🌟</span>
            讓跑團記錄更加精美神聖
            <span className="text-xl">🌟</span>
          </h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <span>🔯</span>
            支援多種神秘格式化選項，讓你的TRPG日誌更具可讀性和神聖美觀度
            <span>🔯</span>
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </div>
        </div>
        
        <LogCanvas preloadedContent={preloadedContent} />
      </main>

      {/* Footer */}
      <footer className="bg-canvas border-t border-canvas-border mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="container mx-auto px-6 py-6 text-center relative">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>⚜️</span>
            © 2024 TRPG神話日誌畫布 | 基於現代神祕學Web技術構建
            <span>⚜️</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
