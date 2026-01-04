import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface FilterChipsProps {
  items: { name: string; stationcount?: number }[];
  selected: string;
  onSelect: (value: string) => void;
  label: string;
}

export const FilterChips = ({ items, selected, onSelect, label }: FilterChipsProps) => {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          <button
            onClick={() => onSelect('')}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm transition-all",
              "border border-border/50",
              !selected 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            All
          </button>
          {items.map((item) => (
            <button
              key={item.name}
              onClick={() => onSelect(item.name)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap",
                "border border-border/50",
                selected === item.name
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
};
