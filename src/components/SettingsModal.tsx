import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SettingsModalProps {
  theme: { background: string; primary: string };
  onThemeChange: (theme: Partial<{ background: string; primary: string }>) => void;
}

export const SettingsModal = ({ theme, onThemeChange }: SettingsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-popover">
        <DialogHeader>
          <DialogTitle className="text-right">הגדרות</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="bg-color" className="text-right block">צבע רקע</Label>
            <div className="flex items-center gap-3">
              <Input
                id="bg-color"
                type="color"
                value={theme.background}
                onChange={(e) => onThemeChange({ background: e.target.value })}
                className="w-14 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={theme.background}
                onChange={(e) => onThemeChange({ background: e.target.value })}
                className="flex-1 text-left"
                dir="ltr"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary-color" className="text-right block">צבע ראשי</Label>
            <div className="flex items-center gap-3">
              <Input
                id="primary-color"
                type="color"
                value={theme.primary}
                onChange={(e) => onThemeChange({ primary: e.target.value })}
                className="w-14 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={theme.primary}
                onChange={(e) => onThemeChange({ primary: e.target.value })}
                className="flex-1 text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
