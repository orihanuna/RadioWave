import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "חיפוש תחנות..." }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10 pl-10 bg-secondary border-border/50 focus:border-primary/50 focus:ring-primary/20 text-right"
        dir="rtl"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => onChange('')}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
