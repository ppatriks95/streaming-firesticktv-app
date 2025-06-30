import { useState, useEffect, useCallback } from 'react';
import { StreamingTile } from '@/components/StreamingTile';
import { AddUrlDialog } from '@/components/AddUrlDialog';
import { SettingsPanel } from '@/components/SettingsPanel';
import { EditStreamDialog } from '@/components/EditStreamDialog';
import { LinkScrapingDialog } from '@/components/LinkScrapingDialog';
import { NavigationProvider } from '@/components/NavigationProvider';
import { Plus, Settings, Grid, List, Tv, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export interface StreamingUrl {
  id: string;
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
  addedAt: number;
  customThumbnail?: string;
  tags?: string[];
}

const Index = () => {
  const [urls, setUrls] = useState<StreamingUrl[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showScrapingDialog, setShowScrapingDialog] = useState(false);
  const [editingUrl, setEditingUrl] = useState<StreamingUrl | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toast } = useToast();

  // Load URLs from local NAT server on component mount
  useEffect(() => {
    const fetchLocalStreams = async () => {
      try {
        // Passe die URL ggf. an deinen lokalen Server an
        const response = await fetch('http://192.168.178.10:3000/streams.json');
        if (!response.ok) throw new Error('Fehler beim Laden der Streams');
        const data = await response.json();
        setUrls(data);
      } catch (error) {
        console.error('Fehler beim Laden der lokalen Streams:', error);
        // Optional: Fallback auf localStorage
        // const savedUrls = localStorage.getItem('streaming-urls');
        // if (savedUrls) {
        //   try {
        //     setUrls(JSON.parse(savedUrls));
        //   } catch (e) {
        //     console.error('Error loading saved URLs:', e);
        //   }
        // }
      }
    };
    fetchLocalStreams();
  }, []);

  // Save URLs to localStorage whenever urls change
  useEffect(() => {
    localStorage.setItem('streaming-urls', JSON.stringify(urls));
  }, [urls]);

  const addUrl = useCallback(async (url: string) => {
    try {
      console.log('Adding URL:', url);
      
      // Create new streaming URL object
      const newUrl: StreamingUrl = {
        id: Date.now().toString(),
        url,
        title: url, // Fallback title
        addedAt: Date.now(),
        tags: []
      };

      // Try to fetch metadata
      try {
        const metadata = await fetchUrlMetadata(url);
        newUrl.title = metadata.title || url;
        newUrl.description = metadata.description;
        newUrl.thumbnail = metadata.thumbnail;
        newUrl.tags = metadata.tags || [];
      } catch (metadataError) {
        console.warn('Could not fetch metadata for URL:', url, metadataError);
      }

      setUrls(prev => [...prev, newUrl]);
      toast({
        title: "URL Added",
        description: `Added "${newUrl.title}" to your streaming list`,
      });
    } catch (error) {
      console.error('Error adding URL:', error);
      toast({
        title: "Error",
        description: "Failed to add URL. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const addMultipleUrls = useCallback(async (urlsToAdd: { url: string; title: string; description?: string }[]) => {
    const newUrls: StreamingUrl[] = urlsToAdd.map(item => ({
      id: Date.now().toString() + Math.random(),
      url: item.url,
      title: item.title,
      description: item.description,
      addedAt: Date.now(),
      tags: []
    }));

    setUrls(prev => [...prev, ...newUrls]);
  }, []);

  const removeUrl = useCallback((id: string) => {
    setUrls(prev => prev.filter(url => url.id !== id));
    toast({
      title: "URL Removed",
      description: "Streaming link has been removed",
    });
  }, [toast]);

  const updateUrl = useCallback((id: string, updates: Partial<StreamingUrl>) => {
    setUrls(prev => prev.map(url => 
      url.id === id ? { ...url, ...updates } : url
    ));
  }, []);

  const handleEditUrl = useCallback((streamingUrl: StreamingUrl) => {
    setEditingUrl(streamingUrl);
    setShowEditDialog(true);
  }, []);

  // Simple metadata fetching simulation (in real app, this would be a backend service)
  const fetchUrlMetadata = async (url: string) => {
    // Simulate metadata fetching delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract domain name as fallback title
    try {
      const domain = new URL(url).hostname;
      const siteName = domain.replace('www.', '').split('.')[0].toUpperCase();
      
      // Auto-tag based on domain
      const tags = [];
      if (domain.includes('youtube')) tags.push('YouTube', 'Video');
      if (domain.includes('aniworld')) tags.push('Anime', 'Series');
      if (domain.includes('netflix')) tags.push('Netflix', 'Movies');
      if (domain.includes('twitch')) tags.push('Twitch', 'Live');
      
      return {
        title: siteName,
        description: `Stream content from ${domain}`,
        thumbnail: `https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop`, // Placeholder
        tags
      };
    } catch {
      return {
        title: 'Streaming Source',
        description: 'Custom streaming link',
        tags: ['Custom']
      };
    }
  };

  const exportUrls = useCallback(() => {
    const dataStr = JSON.stringify(urls, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'streaming-urls.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Your streaming URLs have been exported",
    });
  }, [urls, toast]);

  const importUrls = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedUrls = JSON.parse(e.target?.result as string);
        setUrls(prev => [...prev, ...importedUrls]);
        toast({
          title: "Import Complete",
          description: `Imported ${importedUrls.length} streaming URLs`,
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import URLs. Please check file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Fire TV Streaming Hub
            </h1>
            <p className="text-slate-400 mt-1">Your personal streaming collection</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowScrapingDialog(true)}
              variant="outline"
              size="sm"
              className="bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Scrape Links
            </Button>
            
            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              variant="outline"
              size="sm"
              className="bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              size="sm"
              className="bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add URL
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {urls.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
                <Tv className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No Streaming Sources Yet</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Add your favorite streaming websites or scrape links from series pages to get started.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Single URL
                </Button>
                <Button 
                  onClick={() => setShowScrapingDialog(true)}
                  variant="outline"
                  className="bg-slate-800 border-slate-600 hover:bg-slate-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Scrape Links
                </Button>
              </div>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                : "space-y-4"
            }>
              {urls.map((streamingUrl, index) => (
                <StreamingTile
                  key={streamingUrl.id}
                  url={streamingUrl}
                  onRemove={() => removeUrl(streamingUrl.id)}
                  onUpdate={(updates) => updateUrl(streamingUrl.id, updates)}
                  onEdit={() => handleEditUrl(streamingUrl)}
                  viewMode={viewMode}
                  isSelected={selectedIndex === index}
                  onSelect={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Dialogs */}
        <AddUrlDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddUrl={addUrl}
        />

        <EditStreamDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          streamingUrl={editingUrl}
          onUpdate={(updates) => {
            if (editingUrl) {
              updateUrl(editingUrl.id, updates);
            }
          }}
        />

        <LinkScrapingDialog
          open={showScrapingDialog}
          onOpenChange={setShowScrapingDialog}
          onAddUrls={addMultipleUrls}
        />

        <SettingsPanel
          open={showSettings}
          onOpenChange={setShowSettings}
          urls={urls}
          onExport={exportUrls}
          onImport={importUrls}
          onClearAll={() => {
            setUrls([]);
            toast({
              title: "All URLs Cleared",
              description: "Your streaming list has been cleared",
            });
          }}
        />
      </div>
    </NavigationProvider>
  );
};

export default Index;
