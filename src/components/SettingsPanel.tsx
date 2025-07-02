
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Download, Upload, Trash2 } from 'lucide-react';
import { StreamingUrl } from '@/pages/Index';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  urls: StreamingUrl[];
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAll: () => void;
}

export const SettingsPanel = ({ 
  open, 
  onOpenChange, 
  urls, 
  onExport, 
  onImport, 
  onClearAll 
}: SettingsPanelProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Einstellungen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Daten verwalten</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">
                  Streaming-URLs: {urls.length}
                </span>
              </div>
              
              <Button
                onClick={onExport}
                variant="outline"
                className="w-full bg-slate-700 border-slate-600 hover:bg-slate-600"
              >
                <Download className="w-4 h-4 mr-2" />
                URLs exportieren
              </Button>
              
              <div>
                <Label htmlFor="import" className="cursor-pointer">
                  <Button
                    variant="outline"
                    className="w-full bg-slate-700 border-slate-600 hover:bg-slate-600"
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      URLs importieren
                    </span>
                  </Button>
                </Label>
                <input
                  id="import"
                  type="file"
                  accept=".json"
                  onChange={onImport}
                  className="hidden"
                />
              </div>
              
              <Button
                onClick={onClearAll}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Alle URLs löschen
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Info</h3>
            <div className="text-sm text-slate-400 space-y-1">
              <p>Fire TV Streaming Hub v1.0</p>
              <p>Für Amazon Fire TV Stick optimiert</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
