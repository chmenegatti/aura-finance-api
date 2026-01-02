import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

// Mapa de pseudônimos e ícones com nomes não padronizados
const iconMap: Record<string, LucideIcon> = {
  // Categorias gerais
  "dumbbell": LucideIcons.Dumbbell,
  "utensils": LucideIcons.Utensils,
  "key": LucideIcons.Key,
  "tv": LucideIcons.Tv,
  "cut": LucideIcons.Scissors,
  "gas-pump": LucideIcons.Fuel,
  "shopping-bag": LucideIcons.ShoppingBag,
  "building": LucideIcons.Building,
  "chart-pie": LucideIcons.PieChart,
  "hand-holding-heart": LucideIcons.Heart,
  "credit-card": LucideIcons.CreditCard,
  "graduation-cap": LucideIcons.GraduationCap,
  "bolt": LucideIcons.Zap,
  "pills": LucideIcons.Pill,
  "baby": LucideIcons.Baby,
  "laptop-code": LucideIcons.Laptop,
  "file-invoice-dollar": LucideIcons.FileText,
  "wifi": LucideIcons.Wifi,
  "chart-line": LucideIcons.TrendingUp,
  "gamepad": LucideIcons.Gamepad2,
  "home": LucideIcons.Home,
  "ellipsis-h": LucideIcons.MoreHorizontal,
  "paw": LucideIcons.PawPrint,
  "gift": LucideIcons.Gift,
  "undo-alt": LucideIcons.Undo2,
  "plus-circle": LucideIcons.PlusCircle,
  "coffee": LucideIcons.Coffee,
  "t-shirt": LucideIcons.Shirt,
  "briefcase": LucideIcons.Briefcase,
  "heartbeat": LucideIcons.Heart,
  "shopping-cart": LucideIcons.ShoppingCart,
  "university": LucideIcons.Building2,
  "phone": LucideIcons.Phone,
  "car": LucideIcons.Car,
  "tags": LucideIcons.Tags,
  "plane": LucideIcons.Plane,
  "tint": LucideIcons.Droplet,
};

const DEFAULT_ICON = LucideIcons.Tag;

function getDynamicIcon(iconName: string): LucideIcon | undefined {
  return (LucideIcons as Record<string, LucideIcon>)[iconName];
}

export function getIconComponent(iconName: string | null): JSX.Element {
  if (!iconName) {
    return <DEFAULT_ICON className="w-full h-full" />;
  }

  const normalizedKey = iconName.toLowerCase();
  const mappedIcon = iconMap[normalizedKey];

  if (mappedIcon) {
    const MappedIcon = mappedIcon;
    return <MappedIcon className="w-full h-full" />;
  }

  const dynamicIcon = getDynamicIcon(iconName);
  if (dynamicIcon) {
    const DynamicIcon = dynamicIcon;
    return <DynamicIcon className="w-full h-full" />;
  }

  return <DEFAULT_ICON className="w-full h-full" />;
}
