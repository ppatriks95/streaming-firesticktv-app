
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

export const LinkScrapingDialog = ({ 
  open, 
  onOpenChange, 
  onAddUrls 
}: LinkScrapingDialogProps) => {
  const [pageUrl, setPageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundLinks, setFoundLinks] = useState<{ url: string; title: string }[]>([]);
  const { toast } = useToast();

  const handleScrape = async () => {
    if (!pageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL to scrape",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate scraping (in real app, this would be a backend service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock scraped links for demo
      const mockLinks = [
        { url: `${pageUrl}/episode-1`, title: 'Episode 1' },
        { url: `${pageUrl}/episode-2`, title: 'Episode 2' },
        { url: `${pageUrl}/episode-3`, title: 'Episode 3' },
        { url: `${pageUrl}/episode-4`, title: 'Episode 4' },
      ];
      
      setFoundLinks(mockLinks);
      
      toast({
        title: "Scraping Complete",
        description: `Found ${mockLinks.length} links`,
      });
    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: "Could not scrape links from this page",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSelected = () => {
    if (foundLinks.length === 0) return;
    
    onAddUrls(foundLinks);
    setFoundLinks([]);
    setPageUrl('');
    onOpenChange(false);
    
    toast({
      title: "Links Added",
      description: `Added ${foundLinks.length} streaming links`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Scrape Links from Page</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="pageUrl">Page URL</Label>
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
                onClick={handleScrape}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-slate-400">Scraping links...</p>
            </div>
          )}

          {foundLinks.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Found Links ({foundLinks.length})</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {foundLinks.map((link, index) => (
                  <div key={index} className="bg-slate-700/50 p-2 rounded text-sm">
                    <div className="font-medium">{link.title}</div>
                    <div className="text-slate-400 truncate">{link.url}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              Cancel
            </Button>
            {foundLinks.length > 0 && (
              <Button
                onClick={handleAddSelected}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add All Links
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
