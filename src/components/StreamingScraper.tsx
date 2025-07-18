import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Search, Globe, Link, Video } from 'lucide-react';

interface ScrapedStream {
  url: string;
  title: string;
  description?: string;
  quality?: string;
  type?: 'video' | 'playlist' | 'direct';
}

interface StreamingScraperProps {
  onStreamsFound: (streams: ScrapedStream[]) => void;
}

export const StreamingScraper = ({ onStreamsFound }: StreamingScraperProps) => {
  const [pageUrl, setPageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const detectStreamingPatterns = (url: string) => {
    const patterns = [
      { pattern: /\.m3u8/i, quality: 'HLS Stream', type: 'playlist' as const },
      { pattern: /\.mp4/i, quality: 'MP4 Video', type: 'video' as const },
      { pattern: /\.mkv/i, quality: 'MKV Video', type: 'video' as const },
      { pattern: /\.avi/i, quality: 'AVI Video', type: 'video' as const },
      { pattern: /streamtape|streamlare|doodstream/i, quality: 'Streaming Service', type: 'direct' as const },
      { pattern: /voe\.sx|upstream/i, quality: 'Video Host', type: 'direct' as const }
    ];

    for (const { pattern, quality, type } of patterns) {
      if (pattern.test(url)) {
        return { quality, type };
      }
    }
    return { quality: 'Unknown', type: 'direct' as const };
  };

  const handleScrapeStreams = async () => {
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
      // Simuliere erweiterte Stream-Erkennung
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockStreams: ScrapedStream[] = [];
      const baseUrl = new URL(pageUrl).origin;
      
      // Simuliere verschiedene Stream-Typen basierend auf der URL
      if (pageUrl.includes('aniworld') || pageUrl.includes('anime')) {
        // Anime-spezifische Streams
        const streamServices = [
          { name: 'Streamtape', url: `${baseUrl}/streamtape/`, quality: '720p' },
          { name: 'VOE', url: `${baseUrl}/voe/`, quality: '1080p' },
          { name: 'Doodstream', url: `${baseUrl}/dood/`, quality: '480p' }
        ];
        
        streamServices.forEach((service, index) => {
          const streamInfo = detectStreamingPatterns(service.url);
          mockStreams.push({
            url: `${service.url}episode-1-${service.quality.toLowerCase()}`,
            title: `${service.name} - ${service.quality}`,
            description: `Stream von ${service.name} in ${service.quality}`,
            quality: service.quality,
            type: streamInfo.type
          });
        });
      } else {
        // Allgemeine Stream-Erkennung
        const generalStreams = [
          { ext: 'master.m3u8', quality: 'Adaptive HLS', type: 'playlist' as const },
          { ext: 'playlist.m3u8', quality: '720p HLS', type: 'playlist' as const },
          { ext: 'video.mp4', quality: '1080p MP4', type: 'video' as const },
          { ext: 'stream.mkv', quality: '4K MKV', type: 'video' as const }
        ];
        
        generalStreams.forEach((stream, index) => {
          mockStreams.push({
            url: `${baseUrl}/streams/${stream.ext}`,
            title: `Direct Stream ${index + 1}`,
            description: `${stream.quality} - ${stream.type}`,
            quality: stream.quality,
            type: stream.type
          });
        });
      }

      if (mockStreams.length > 0) {
        onStreamsFound(mockStreams);
        toast({
          title: "Streams gefunden",
          description: `${mockStreams.length} Streaming-Quellen wurden erkannt`,
        });
      } else {
        toast({
          title: "Keine Streams gefunden",
          description: "Keine kompatiblen Streaming-Quellen auf der Seite erkannt",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error scraping streams:', error);
      toast({
        title: "Fehler",
        description: "Streams konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="streamUrl" className="text-sm font-medium text-slate-300">
          Stream-Seite URL
        </Label>
        <div className="flex gap-2 mt-1">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="streamUrl"
              type="url"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              placeholder="https://example.com/watch/episode..."
              className="bg-slate-700 border-slate-600 text-white pl-10"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleScrapeStreams}
            disabled={isLoading || !pageUrl.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Analysiere...' : 'Streams finden'}
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-slate-400 flex items-start gap-2">
        <Video className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="mb-1">
            <strong>Unterstützte Formate:</strong> M3U8, MP4, MKV, AVI
          </p>
          <p>
            <strong>Erkannte Services:</strong> Streamtape, VOE, Doodstream, Streamlare und mehr
          </p>
        </div>
      </div>
    </div>
  );
};