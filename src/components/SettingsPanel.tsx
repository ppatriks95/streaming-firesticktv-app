
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, Trash2, FileText } from 'lucide-react';
import { StreamingUrl } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearAll = () => {
    if (urls.length === 0) {
      toast({
        title: "Nothing to Clear",
        description: "Your streaming list is already empty",
      });
      return;
    }

    if (confirm('Are you sure you want to remove all streaming URLs? This action cannot be undone.')) {
      onClearAll();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Statistics */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Statistics</h3>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total URLs:</span>
                <span className="font-semibold">{urls.length}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Data Management */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Data Management</h3>
            <div className="space-y-3">
              <Button
                onClick={onExport}
                variant="outline"
                className="w-full bg-slate-700 border-slate-600 hover:bg-slate-600 justify-start"
                disabled={urls.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export URLs to JSON
              </Button>
              
              <Button
                onClick={handleImportClick}
                variant="outline"
                className="w-full bg-slate-700 border-slate-600 hover:bg-slate-600 justify-start"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import URLs from JSON
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={onImport}
                className="hidden"
              />
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Danger Zone */}
          <div>
            <h3 className="text-sm font-medium text-red-400 mb-3">Danger Zone</h3>
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All URLs
            </Button>
          </div>

          <Separator className="bg-slate-700" />

          {/* Instructions */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Fire TV Instructions</h3>
            <div className="bg-slate-700/30 rounded-lg p-4 text-sm text-slate-400 space-y-2">
              <p>• Use D-Pad to navigate between tiles</p>
              <p>• Press OK/Enter to select and open streams</p>
              <p>• Long press for context menu options</p>
              <p>• Use Back button to return to main menu</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="bg-slate-700 border-slate-600 hover:bg-slate-600"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
