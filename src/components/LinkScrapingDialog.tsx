
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
import { Search, Plus } from 'lucide-react';

interface LinkScrapingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUrls: (urls: { url: string; title: string; description?: string }[]) => void;
}

export const LinkScrapingDialog = ({ open, onOpenChange, onAddUrls }: LinkScrapingDialogProps) => {
  const [pageUrl, setPageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedLinks, setScrapedLinks] = useState<{ url: string; title: string; description?: string }[]>([]);
  const { toast } = useToast();

  const handleScrapeLinks = async () => {
    if (!pageUrl.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib eine gültige URL ein",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simuliere Link-Scraping (in echter Implementierung würde hier eine API aufgerufen)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Beispiel-Links basierend auf der URL
      const mockLinks = [
        {
          url: `${pageUrl}/episode-1`,
          title: "Episode 1",
          description: "Erste Episode der Serie"
        },
        {
          url: `${pageUrl}/episode-2`,
          title: "Episode 2", 
          description: "Zweite Episode der Serie"
        },
        {
          url: `${pageUrl}/episode-3`,
          title: "Episode 3",
          description: "Dritte Episode der Serie"
        }
      ];
      
      setScrapedLinks(mockLinks);
      toast({
        title: "Links gefunden",
        description: `${mockLinks.length} Links wurden gefunden`,
      });
    } catch (error) {
      console.error('Error scraping links:', error);
      toast({
        title: "Fehler",
        description: "Links konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllLinks = () => {
    if (scrapedLinks.length > 0) {
      onAddUrls(scrapedLinks);
      toast({
        title: "Links hinzugefügt",
        description: `${scrapedLinks.length} Links wurden zu deiner Sammlung hinzugefügt`,
      });
      onOpenChange(false);
      setScrapedLinks([]);
      setPageUrl('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Links von Seite extrahieren</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="pageUrl">Seiten-URL</Label>
            <div className="flex gap-2">
              <Input
                id="pageUrl"
                type="url"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                placeholder="https://aniworld.to/anime/stream/..."
                className="bg-slate-700 border-slate-600 text-white"
                disabled={isLoading}
              />
              <Button
                onClick={handleScrapeLinks}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? 'Suche...' : 'Suchen'}
              </Button>
            </div>
          </div>

          {scrapedLinks.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Gefundene Links ({scrapedLinks.length})</h3>
              <div className="max-h-64 overflow-y-auto space-y-2 bg-slate-900 p-3 rounded">
                {scrapedLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{link.title}</div>
                      <div className="text-xs text-slate-400 truncate">{link.url}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              Abbrechen
            </Button>
            {scrapedLinks.length > 0 && (
              <Button
                onClick={handleAddAllLinks}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Alle hinzufügen
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
