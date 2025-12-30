import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

// Mapa de nomes de ícones para componentes Lucide
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

export function getIconComponent(iconName: string | null): JSX.Element {
  if (!iconName) {
    return <LucideIcons.Tag className="w-full h-full" />;
  }

  const IconComponent = iconMap[iconName];

  if (IconComponent) {
    return <IconComponent className="w-full h-full" />;
  }

  // Fallback para ícone padrão
  return <LucideIcons.Tag className="w-full h-full" />;
}

export function getIconName(iconName: string | null): string {
  if (!iconName || !iconMap[iconName]) {
    return "🏷️";
  }
  return iconName;
}
