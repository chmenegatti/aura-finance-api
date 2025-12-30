import { getIconComponent } from "@/utils/iconMapper";

interface CategoryIconProps {
  iconName: string | null;
  className?: string;
}

export function CategoryIcon({ iconName, className = "w-5 h-5" }: CategoryIconProps) {
  return (
    <span className={className}>
      {getIconComponent(iconName)}
    </span>
  );
}
