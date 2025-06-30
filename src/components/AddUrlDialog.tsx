
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';

interface AddUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUrl: (url: string) => Promise<void>;
}

export const AddUrlDialog = ({ open, onOpenChange, onAddUrl }: AddUrlDialogProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setIsLoading(true);
      await onAddUrl(url.trim());
      setUrl('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Streaming URL</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url" className="text-sm font-medium text-slate-300">
              Streaming URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/stream"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-slate-400">
              Enter the URL of your streaming source. The app will automatically fetch the title and thumbnail.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!url.trim() || !isValidUrl(url.trim()) || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add URL
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
