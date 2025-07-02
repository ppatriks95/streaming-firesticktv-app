
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
import { useToast } from '@/hooks/use-toast';

interface AddUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUrl: (url: string) => void;
}

export const AddUrlDialog = ({ open, onOpenChange, onAddUrl }: AddUrlDialogProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib eine gültige URL ein",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAddUrl(url.trim());
      setUrl('');
      onOpenChange(false);
      toast({
        title: "Erfolgreich",
        description: "URL wurde hinzugefügt",
      });
    } catch (error) {
      console.error('Error adding URL:', error);
      toast({
        title: "Fehler",
        description: "URL konnte nicht hinzugefügt werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUrl('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Streaming URL hinzufügen</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://aniworld.to/anime/stream/..."
              className="bg-slate-700 border-slate-600 text-white text-lg p-4"
              disabled={isLoading}
              autoFocus
              style={{
                fontSize: '18px',
                padding: '16px',
                minHeight: '56px'
              }}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-lg p-4"
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-lg p-4"
            >
              {isLoading ? 'Wird hinzugefügt...' : 'URL hinzufügen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
