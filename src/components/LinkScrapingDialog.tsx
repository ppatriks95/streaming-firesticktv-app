
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScrapedLink {
  url: string;
  title: string;
  description?: string;
  selected: boolean;
}

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
  const [isScanning, setIsScanning] = useState(false);
  const [scrapedLinks, setScrapedLinks] = useState<ScrapedLink[]>([]);
  const { toast } = useToast();

  const scrapeLinks = async () => {
    if (!pageUrl.trim()) return;
    
    setIsScanning(true);
    try {
      // Simuliere Link-Scraping (in echter App würde hier eine Proxy-API verwendet)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock-Daten für Demo (in echter App würde hier echtes Scraping stattfinden)
      const mockLinks: ScrapedLink[] = [
        {
          url: pageUrl + '/episode-1',
          title: 'Episode 1 - Pilot',
          description: 'First episode of the series',
          selected: true
        },
        {
          url: pageUrl + '/episode-2', 
          title: 'Episode 2 - Continuation',
          description: 'Second episode',
          selected: true
        },
        {
          url: pageUrl + '/episode-3',
          title: 'Episode 3 - Plot Twist', 
          description: 'Third episode with surprises',
          selected: true
        }
      ];
      
      setScrapedLinks(mockLinks);
      toast({
        title: "Scraping Complete",
        description: `Found ${mockLinks.length} potential streaming links`,
      });
    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: "Could not access the page. Check URL and network connection.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const toggleLinkSelection = (index: number) => {
    setScrapedLinks(prev => 
      prev.map((link, i) => 
        i === index ? { ...link, selected: !link.selected } : link
      )
    );
  };

  const selectAll = () => {
    setScrapedLinks(prev => prev.map(link => ({ ...link, selected: true })));
  };

  const selectNone = () => {
    setScrapedLinks(prev => prev.map(link => ({ ...link, selected: false })));
  };

  const addSelectedLinks = () => {
    const selectedLinks = scrapedLinks
      .filter(link => link.selected)
      .map(link => ({
        url: link.url,
        title: link.title,
        description: link.description
      }));
    
    if (selectedLinks.length > 0) {
      onAddUrls(selectedLinks);
      toast({
        title: "Links Added",
        description: `Added ${selectedLinks.length} streaming links to your collection`,
      });
      onOpenChange(false);
      setScrapedLinks([]);
      setPageUrl('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scrape Streaming Links</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="pageUrl">Page URL to Scan</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="pageUrl"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://aniworld.to/anime/stream/..."
              />
              <Button
                onClick={scrapeLinks}
                disabled={isScanning || !pageUrl.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isScanning ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Note: In Fire TV app, this would use a proxy service to bypass CORS restrictions
            </p>
          </div>

          {scrapedLinks.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Found Links ({scrapedLinks.length})</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={selectAll}
                    size="sm"
                    variant="outline"
                    className="bg-slate-700 border-slate-600"
                  >
                    Select All
                  </Button>
                  <Button
                    onClick={selectNone}
                    size="sm"
                    variant="outline"
                    className="bg-slate-700 border-slate-600"
                  >
                    Select None
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {scrapedLinks.map((link, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg"
                  >
                    <Checkbox
                      checked={link.selected}
                      onCheckedChange={() => toggleLinkSelection(index)}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-white truncate">
                        {link.title}
                      </h4>
                      {link.description && (
                        <p className="text-xs text-slate-400 mt-1">
                          {link.description}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {link.url}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Badge variant="secondary" className="bg-blue-600">
                  {scrapedLinks.filter(link => link.selected).length} selected
                </Badge>
                <Button
                  onClick={addSelectedLinks}
                  disabled={scrapedLinks.filter(link => link.selected).length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Selected Links
                </Button>
              </div>
            </>
          )}
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
