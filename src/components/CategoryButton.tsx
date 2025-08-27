import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryButtonProps {
  name: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  color: "online" | "framework" | "ooc" | "time" | "dice";
}

export function CategoryButton({ name, icon, isActive, onClick, color }: CategoryButtonProps) {
  return (
    <Button
      variant={isActive ? "category-active" : "category"}
      size="sm"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 transition-all duration-300 hover:scale-105",
        // Apply category-specific colors using CSS custom properties
        isActive && `text-category-${color} border-category-${color}`,
        !isActive && `hover:text-category-${color} hover:border-category-${color}/50`
      )}
      style={{
        '--category-color': `hsl(var(--category-${color}))`,
      } as React.CSSProperties}
    >
      {icon}
      <span className="font-medium">{name}</span>
    </Button>
  );
}