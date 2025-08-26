
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategoryButton } from "@/components/CategoryButton";
import { Copy, Download, Trash2, Eye, Code, MessageSquare, Clock, Dice6, Image, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface LogCanvasProps {
  preloadedContent?: string;
}

export function LogCanvas({ preloadedContent = "" }: LogCanvasProps) {
  const [inputText, setInputText] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [processedOutput, setProcessedOutput] = useState("");

  // 當有預載內容時自動填入
  useEffect(() => {
    if (preloadedContent) {
      setInputText(preloadedContent);
      toast({
        title: "📖 已載入外部日誌",
        description: "來自 Discord Bot 的日誌內容已自動填入",
      });
    }
  }, [preloadedContent]);

  const categories = [
    { id: "online", name: "🖼️ 線上圖片", icon: <Image size={16} />, color: "online" as const },
    { id: "framework", name: "⚡ 框架代碼", icon: <Code size={16} />, color: "framework" as const },
    { id: "ooc", name: "💭 場外發言", icon: <MessageSquare size={16} />, color: "ooc" as const },
    { id: "time", name: "🕐 發言時間", icon: <Clock size={16} />, color: "time" as const },
    { id: "dice", name: "🎲 骰子指令", icon: <Dice6 size={16} />, color: "dice" as const },
  ];

  const toggleCategory = (categoryId: string) => {
    setActiveCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const processLog = () => {
    if (!inputText.trim()) {
      toast({
        title: "🔮 請輸入日誌內容",
        description: "請在輸入框中輸入需要格式化的跑團記錄",
        variant: "destructive",
      });
      return;
    }

    // Simple processing logic - can be expanded
    let processed = inputText;
    
    if (activeCategories.includes("time")) {
      processed = processed.replace(/(\d{2}:\d{2}:\d{2})/g, '<span class="time-stamp">$1</span>');
    }
    
    if (activeCategories.includes("dice")) {
      processed = processed.replace(/(\d+d\d+)/gi, '<span class="dice-roll">$1</span>');
    }
    
    if (activeCategories.includes("ooc")) {
      processed = processed.replace(/\((.*?)\)/g, '<span class="ooc-text">($1)</span>');
    }
    
    setProcessedOutput(processed);
    toast({
      title: "✨ 處理完成",
      description: "日誌已成功格式化，充滿神聖光輝",
    });
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(processedOutput);
      toast({
        title: "📋 複製成功",
        description: "格式化結果已複製到剪貼板",
      });
    } catch (error) {
      toast({
        title: "⚠️ 複製失敗",
        description: "無法複製到剪貼板，請手動複製",
        variant: "destructive",
      });
    }
  };

  const openInViewer = () => {
    if (!processedOutput) return;
    
    const encodedContent = btoa(encodeURIComponent(processedOutput));
    const timestamp = Date.now();
    const viewerUrl = `/#/log/${timestamp}?data=${encodedContent}&name=格式化日誌`;
    
    window.open(viewerUrl, '_blank');
    toast({
      title: "🚀 已開啟查看器",
      description: "格式化結果已在新頁面中開啟",
    });
  };

  const clearAll = () => {
    setInputText("");
    setProcessedOutput("");
    setActiveCategories([]);
    toast({
      title: "🧹 已清空",
      description: "所有內容已清除，回歸虛無",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full relative">
      {/* Mystical connecting line */}
      <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent z-10"></div>
      
      {/* Input Panel */}
      <Card className="p-6 bg-canvas border-canvas-border shadow-soft relative overflow-hidden">
        {/* Mystical corner decorations */}
        <div className="absolute top-2 left-2 text-xs opacity-20">✧</div>
        <div className="absolute top-2 right-2 text-xs opacity-20">✧</div>
        <div className="absolute bottom-2 left-2 text-xs opacity-20">✧</div>
        <div className="absolute bottom-2 right-2 text-xs opacity-20">✧</div>
        
        <div className="space-y-4 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span>📝</span>
              輸入神話日誌
              <span>🌙</span>
            </h2>
            <Button variant="soft" size="sm" onClick={clearAll} className="flex items-center gap-1">
              <Trash2 size={16} />
              <span>🔥</span>
              清空
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-primary/10 rounded-lg blur-sm"></div>
            <Textarea 
              placeholder="請輸入桌上角色扮演遊戲記錄內容... 📖✨"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] bg-editor border-editor-border resize-none font-mono text-sm relative"
            />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span>🔮</span>
              神祕格式化選項
              <span>✨</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  name={category.name}
                  icon={category.icon}
                  color={category.color}
                  isActive={activeCategories.includes(category.id)}
                  onClick={() => toggleCategory(category.id)}
                />
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-primary/20 rounded-lg blur-sm"></div>
            <Button 
              variant="canvas" 
              size="lg" 
              onClick={processLog}
              className="w-full relative flex items-center gap-2"
              disabled={!inputText.trim()}
            >
              <Eye size={16} />
              <span>🔍</span>
              預覽神聖格式化
              <span>⚡</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Output Panel */}
      <Card className="p-6 bg-canvas border-canvas-border shadow-soft relative overflow-hidden">
        {/* Mystical corner decorations */}
        <div className="absolute top-2 left-2 text-xs opacity-20">✦</div>
        <div className="absolute top-2 right-2 text-xs opacity-20">✦</div>
        <div className="absolute bottom-2 left-2 text-xs opacity-20">✦</div>
        <div className="absolute bottom-2 right-2 text-xs opacity-20">✦</div>
        
        <div className="space-y-4 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span>📜</span>
              神聖格式化結果
              <span>✨</span>
            </h2>
            <div className="flex gap-2">
              <Button variant="soft" size="sm" onClick={copyOutput} disabled={!processedOutput} className="flex items-center gap-1">
                <Copy size={16} />
                <span>📋</span>
                複製
              </Button>
              <Button variant="outline" size="sm" onClick={openInViewer} disabled={!processedOutput} className="flex items-center gap-1">
                <ExternalLink size={16} />
                <span>🚀</span>
                查看器
              </Button>
              <Button variant="outline" size="sm" disabled={!processedOutput} className="flex items-center gap-1">
                <Download size={16} />
                <span>💾</span>
                導出
              </Button>
            </div>
          </div>
          
          <div className="bg-editor border border-editor-border rounded-md p-4 min-h-[300px] relative">
            <div className="absolute top-1 right-1 text-xs opacity-20">🌟</div>
            {processedOutput ? (
              <div 
                className="text-sm font-mono whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: processedOutput }}
              />
            ) : (
              <div className="text-muted-foreground text-sm text-center py-12 flex flex-col items-center gap-2">
                <span className="text-2xl opacity-50">🔮</span>
                <p>處理後的神聖日誌內容將在此顯示</p>
                <span className="text-xl opacity-30">✨📖✨</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
