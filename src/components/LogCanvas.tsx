import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategoryButton } from "@/components/CategoryButton";
import { Copy, Download, Trash2, Eye, Code, MessageSquare, Clock, Dice6, Image } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface LogCanvasProps {}

export function LogCanvas({}: LogCanvasProps) {
  const [inputText, setInputText] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [processedOutput, setProcessedOutput] = useState("");

  const categories = [
    { id: "online", name: "在线图片", icon: <Image size={16} />, color: "online" as const },
    { id: "framework", name: "框架代码", icon: <Code size={16} />, color: "framework" as const },
    { id: "ooc", name: "场外发言", icon: <MessageSquare size={16} />, color: "ooc" as const },
    { id: "time", name: "发言时间", icon: <Clock size={16} />, color: "time" as const },
    { id: "dice", name: "骰指令", icon: <Dice6 size={16} />, color: "dice" as const },
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
        title: "请输入日志内容",
        description: "请在输入框中输入需要格式化的跑团记录",
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
      title: "处理完成",
      description: "日志已成功格式化",
    });
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(processedOutput);
      toast({
        title: "复制成功",
        description: "格式化结果已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板，请手动复制",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInputText("");
    setProcessedOutput("");
    setActiveCategories([]);
    toast({
      title: "已清空",
      description: "所有内容已清除",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Panel */}
      <Card className="p-6 bg-canvas border-canvas-border shadow-soft">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">输入日志</h2>
            <Button variant="soft" size="sm" onClick={clearAll}>
              <Trash2 size={16} />
              清空
            </Button>
          </div>
          
          <Textarea 
            placeholder="请输入跑团记录内容..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[300px] bg-editor border-editor-border resize-none font-mono text-sm"
          />
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">格式化选项</h3>
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
          
          <Button 
            variant="canvas" 
            size="lg" 
            onClick={processLog}
            className="w-full"
            disabled={!inputText.trim()}
          >
            <Eye size={16} />
            预览格式化
          </Button>
        </div>
      </Card>

      {/* Output Panel */}
      <Card className="p-6 bg-canvas border-canvas-border shadow-soft">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">格式化结果</h2>
            <div className="flex gap-2">
              <Button variant="soft" size="sm" onClick={copyOutput} disabled={!processedOutput}>
                <Copy size={16} />
                复制
              </Button>
              <Button variant="outline" size="sm" disabled={!processedOutput}>
                <Download size={16} />
                导出
              </Button>
            </div>
          </div>
          
          <div className="bg-editor border border-editor-border rounded-md p-4 min-h-[300px]">
            {processedOutput ? (
              <div 
                className="text-sm font-mono whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: processedOutput }}
              />
            ) : (
              <div className="text-muted-foreground text-sm text-center py-12">
                处理后的日志内容将在此显示
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}