import { Radio } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

interface HeaderProps {
  theme: { background: string; primary: string };
  onThemeChange: (theme: Partial<{ background: string; primary: string }>) => void;
}

export const Header = ({ theme, onThemeChange }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <SettingsModal theme={theme} onThemeChange={onThemeChange} />
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Radio className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-display font-bold text-foreground">
            Radio<span className="text-primary">Wave</span>
          </h1>
        </div>
      </div>
    </header>
  );
};
