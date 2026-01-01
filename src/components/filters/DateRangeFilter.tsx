import { useState } from "react";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const presets = [
  {
    label: "Este mês",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Mês passado",
    getValue: () => ({
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
  {
    label: "Últimos 3 meses",
    getValue: () => ({
      from: startOfMonth(subMonths(new Date(), 2)),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Últimos 6 meses",
    getValue: () => ({
      from: startOfMonth(subMonths(new Date(), 5)),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Este ano",
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
];

export const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const formatRange = (range: DateRange) => {
    return `${format(range.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(range.to, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{formatRange(value)}</span>
            <span className="sm:hidden">Período</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.label}
              onClick={() => onChange(preset.getValue())}
            >
              {preset.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={() => setIsCustomOpen(true)}>
            Personalizado...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Date Range Popover */}
      <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <PopoverTrigger asChild>
          <span className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="end">
          <div className="space-y-4">
            <div className="text-sm font-medium text-foreground">
              Selecione o período
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">De</label>
                <Calendar
                  mode="single"
                  selected={value.from}
                  onSelect={(date) => date && onChange({ ...value, from: date })}
                  className="pointer-events-auto rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Até</label>
                <Calendar
                  mode="single"
                  selected={value.to}
                  onSelect={(date) => date && onChange({ ...value, to: date })}
                  className="pointer-events-auto rounded-md border"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setIsCustomOpen(false)}>
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};