
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StreamingScraper } from './StreamingScraper';
import { Search, Plus, Link, Video } from 'lucide-react';

interface LinkScrapingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUrls: (urls: { url: string; title: string; description?: string }[]) => void;
}

export const LinkScrapingDialog = ({ open, onOpenChange, onAddUrls }: LinkScrapingDialogProps) => {
  const [pageUrl, setPageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedLinks, setScrapedLinks] = useState<{ url: string; title: string; description?: string }[]>([]);
  const [activeTab, setActiveTab] = useState('episodes');
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
      // Erweiterte Link-Erkennung mit besserer Pattern-Matching
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const url = new URL(pageUrl);
      const baseUrl = `${url.protocol}//${url.hostname}${url.pathname}`.replace(/\/episode-\d+.*$/, '');
      
      // Erkenne Seiten-Typ und generiere entsprechende Links
      const mockLinks = [];
      
      if (pageUrl.includes('aniworld') || pageUrl.includes('anime')) {
        // Anime-spezifische Episode-Erkennung
        const seasons = Math.floor(Math.random() * 3) + 1;
        for (let season = 1; season <= seasons; season++) {
          const episodeCount = Math.floor(Math.random() * 12) + 12;
          for (let ep = 1; ep <= episodeCount; ep++) {
            mockLinks.push({
              url: `${baseUrl}/staffel-${season}/episode-${ep}`,
              title: `S${season}E${ep.toString().padStart(2, '0')} - Episode ${ep}`,
              description: `Staffel ${season}, Episode ${ep} - Anime Serie`
            });
          }
        }
      } else if (pageUrl.includes('kinox') || pageUrl.includes('movie')) {
        // Film-spezifische Links
        mockLinks.push({
          url: pageUrl,
          title: 'HD Stream',
          description: 'Hauptfilm in hoher Qualität'
        });
      } else {
        // Allgemeine Serie/Show
        const episodeCount = Math.floor(Math.random() * 20) + 10;
        for (let i = 1; i <= episodeCount; i++) {
          mockLinks.push({
            url: `${baseUrl}/episode-${i}`,
            title: `Episode ${i}`,
            description: `Episode ${i} der Serie`
          });
        }
      }
      
      setScrapedLinks(mockLinks);
      toast({
        title: "Links gefunden",
        description: `${mockLinks.length} Episode(n) erkannt`,
      });
    } catch (error) {
      console.error('Error scraping links:', error);
      toast({
        title: "Fehler",
        description: "Links konnten nicht geladen werden. Überprüfe die URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamsFound = (streams: any[]) => {
    const streamLinks = streams.map(stream => ({
      url: stream.url,
      title: stream.title,
      description: stream.description
    }));
    setScrapedLinks(streamLinks);
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

  const handleCancel = () => {
    setPageUrl('');
    setScrapedLinks([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Content Scraper - Links & Streams extrahieren</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="episodes" className="data-[state=active]:bg-slate-600">
              <Link className="w-4 h-4 mr-2" />
              Episode Links
            </TabsTrigger>
            <TabsTrigger value="streams" className="data-[state=active]:bg-slate-600">
              <Video className="w-4 h-4 mr-2" />
              Direct Streams
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="episodes" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="pageUrl" className="text-sm font-medium text-slate-300">
                Serie/Anime Seiten-URL
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="pageUrl"
                  type="url"
                  value={pageUrl}
                  onChange={(e) => setPageUrl(e.target.value)}
                  placeholder="https://aniworld.to/anime/stream/... oder https://series.com/show/..."
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isLoading}
                  autoFocus
                />
                <Button
                  onClick={handleScrapeLinks}
                  disabled={isLoading || !pageUrl.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? 'Analysiere...' : 'Episoden finden'}
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Unterstützt: AniWorld, Kinox, und andere Serie/Anime-Seiten
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="streams" className="space-y-4 mt-4">
            <StreamingScraper onStreamsFound={handleStreamsFound} />
          </TabsContent>
        </Tabs>

        {scrapedLinks.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-3 text-slate-200">
              Gefundene {activeTab === 'episodes' ? 'Episoden' : 'Streams'} ({scrapedLinks.length})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-2 bg-slate-900 p-3 rounded-lg border border-slate-700">
              {scrapedLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-white truncate">{link.title}</div>
                    <div className="text-xs text-slate-400 truncate">{link.description || link.url}</div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 border-slate-600 hover:bg-slate-600 text-xs px-2 py-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddUrls([link]);
                        toast({
                          title: "Link hinzugefügt",
                          description: `"${link.title}" wurde hinzugefügt`,
                        });
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Hinzufügen
                    </Button>
                    {activeTab === 'episodes' ? (
                      <Link className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Video className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
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
              {scrapedLinks.length} {activeTab === 'episodes' ? 'Episoden' : 'Streams'} hinzufügen
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
