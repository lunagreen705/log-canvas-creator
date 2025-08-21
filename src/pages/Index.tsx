import { LogCanvas } from "@/components/LogCanvas";
import trpgLogo from "@/assets/trpg-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-canvas">
      {/* Header */}
      <header className="bg-canvas border-b border-canvas-border shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={trpgLogo} alt="TRPG Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  TRPG日志画布
                </h1>
                <p className="text-sm text-muted-foreground">专业的跑团记录格式化工具</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">v2.0</p>
              <p className="text-xs text-muted-foreground">现代化重制版</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">让跑团记录更加精美</h2>
          <p className="text-muted-foreground">
            支持多种格式化选项，让你的TRPG日志更具可读性和美观度
          </p>
        </div>
        
        <LogCanvas />
      </main>

      {/* Footer */}
      <footer className="bg-canvas border-t border-canvas-border mt-16">
        <div className="container mx-auto px-6 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 TRPG日志画布 | 基于现代Web技术构建
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;