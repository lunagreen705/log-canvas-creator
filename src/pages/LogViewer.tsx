import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import trpgLogo from "@/assets/trpg-logo.png";

interface LogEntry {
  timestamp: string;
  nickname: string;
  text: string;
}

const LogViewer = () => {
  const { logId } = useParams();
  const [searchParams] = useSearchParams();
  const [logData, setLogData] = useState<{
    logName: string;
    content: string;
    entries: LogEntry[];
    guildId?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogData = () => {
      try {
        // 嘗試從 URL 參數獲取日誌數據
        const encodedData = searchParams.get('data');
        const logName = searchParams.get('name') || '未命名日誌';
        const guildId = searchParams.get('guild');
        
        if (encodedData) {
          // 解碼 Base64 編碼的日誌內容
          const decodedContent = decodeURIComponent(atob(encodedData));
          const parsedEntries = parseLogContent(decodedContent);
          
          setLogData({
            logName,
            content: decodedContent,
            entries: parsedEntries,
            guildId: guildId || undefined
          });
        } else {
          // 如果沒有數據，顯示錯誤
          toast({
            title: "❌ 無法載入日誌",
            description: "日誌數據不存在或已過期",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('載入日誌數據時發生錯誤:', error);
        toast({
          title: "❌ 載入失敗",
          description: "日誌數據格式錯誤",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadLogData();
  }, [logId, searchParams]);

  const parseLogContent = (content: string): LogEntry[] => {
    const entries: LogEntry[] = [];
    const regex = /\[(.*?)\]\s(.*?):\n([\s\S]*?)(?=\n\n\[|$)/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      entries.push({
        timestamp: match[1].trim(),
        nickname: match[2].trim(),
        text: match[3].trim()
      });
    }
    
    return entries;
  };

  const copyContent = async () => {
    if (!logData) return;
    
    try {
      await navigator.clipboard.writeText(logData.content);
      toast({
        title: "📋 複製成功",
        description: "日誌內容已複製到剪貼板",
      });
    } catch (error) {
      toast({
        title: "⚠️ 複製失敗",
        description: "無法複製到剪貼板，請手動複製",
        variant: "destructive",
      });
    }
  };

  const exportAsFile = () => {
    if (!logData) return;
    
    const blob = new Blob([logData.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${logData.logName.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "💾 導出成功",
      description: "日誌已導出為文字檔案",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔮</div>
          <p className="text-muted-foreground">正在載入神聖日誌...</p>
        </div>
      </div>
    );
  }

  if (!logData) {
    return (
      <div className="min-h-screen bg-gradient-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-muted-foreground mb-4">找不到請求的日誌</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft size={16} className="mr-2" />
              回到首頁
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-canvas relative overflow-hidden">
      {/* Mystical background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">⚔️</div>
        <div className="absolute top-20 right-20 text-4xl">🔮</div>
        <div className="absolute bottom-20 left-20 text-5xl">📜</div>
        <div className="absolute bottom-10 right-10 text-4xl">🕯️</div>
      </div>
      
      {/* Header */}
      <header className="bg-canvas border-b border-canvas-border shadow-soft relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="container mx-auto px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  返回
                </Button>
              </Link>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-primary rounded-full opacity-50 blur-sm"></div>
                  <img src={trpgLogo} alt="TRPG Logo" className="w-10 h-10 relative z-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
                    <span>📖</span>
                    {logData.logName}
                    <span>✨</span>
                  </h1>
                  <p className="text-sm text-muted-foreground">TRPG 神話日誌檢視器</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="soft" size="sm" onClick={copyContent}>
                <Copy size={16} className="mr-2" />
                複製
              </Button>
              <Button variant="outline" size="sm" onClick={exportAsFile}>
                <Download size={16} className="mr-2" />
                導出
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative">
        <Card className="p-6 bg-canvas border-canvas-border shadow-soft">
          <div className="space-y-6">
            {/* Log Info */}
            <div className="border-b border-canvas-border pb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>📊</span>
                  日誌資訊
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">日誌名稱: </span>
                  <span className="font-mono">{logData.logName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">對話條數: </span>
                  <span className="font-mono">{logData.entries.length}</span>
                </div>
                {logData.guildId && (
                  <div>
                    <span className="text-muted-foreground">伺服器ID: </span>
                    <span className="font-mono">{logData.guildId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Log Entries */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>💬</span>
                對話記錄
                <span>✨</span>
              </h3>
              
              <div className="space-y-3">
                {logData.entries.map((entry, index) => (
                  <div key={index} className="bg-editor border border-editor-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                      <span className="text-primary">🕐</span>
                      <span className="font-mono">{entry.timestamp}</span>
                      <span className="text-primary">👤</span>
                      <span className="font-semibold text-foreground">{entry.nickname}</span>
                    </div>
                    <div className="font-mono text-sm whitespace-pre-wrap pl-4 border-l-2 border-primary/20">
                      {entry.text}
                    </div>
                  </div>
                ))}
              </div>
              
              {logData.entries.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-4">📭</div>
                  <p>此日誌中沒有解析到對話記錄</p>
                </div>
              )}
            </div>

            {/* Raw Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>📄</span>
                原始內容
                <span>🔍</span>
              </h3>
              <div className="bg-editor border border-editor-border rounded-lg p-4">
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  {logData.content}
                </pre>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default LogViewer;