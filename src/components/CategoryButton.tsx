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
  const colorClasses = {
    online: "hover:bg-category-online/10 data-[active=true]:bg-category-online/15 data-[active=true]:border-category-online data-[active=true]:text-category-online",
    framework: "hover:bg-category-framework/10 data-[active=true]:bg-category-framework/15 data-[active=true]:border-category-framework data-[active=true]:text-category-framework",
    ooc: "hover:bg-category-ooc/10 data-[active=true]:bg-category-ooc/15 data-[active=true]:border-category-ooc data-[active=true]:text-category-ooc",
    time: "hover:bg-category-time/10 data-[active=true]:bg-category-time/15 data-[active=true]:border-category-time data-[active=true]:text-category-time",
    dice: "hover:bg-category-dice/10 data-[active=true]:bg-category-dice/15 data-[active=true]:border-category-dice data-[active=true]:text-category-dice"
  };

  return (
    <Button
      variant="category"
      size="sm"
      onClick={onClick}
      data-active={isActive}
      className={cn(
        "flex items-center gap-2 transition-all duration-300 hover:scale-105",
        colorClasses[color]
      )}
    >
      {icon}
      <span className="font-medium">{name}</span>
    </Button>
  );
}