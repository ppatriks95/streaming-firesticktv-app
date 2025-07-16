import { useState, useEffect, useCallback } from 'react';
import { StreamingTile } from '@/components/StreamingTile';
import { AddUrlDialog } from '@/components/AddUrlDialog';
import { SettingsPanel } from '@/components/SettingsPanel';
import { EditStreamDialog } from '@/components/EditStreamDialog';
import { LinkScrapingDialog } from '@/components/LinkScrapingDialog';
import { ServerSettings } from '@/components/ServerSettings';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SeriesDetailView } from '@/components/SeriesDetailView';
import { NavigationProvider } from '@/components/NavigationProvider';
import { Plus, Settings, Grid, List, Tv, Search, Server, RefreshCw } from 'lucide-react';
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
  type?: 'movie' | 'series' | 'live' | 'other';
  episodes?: Array<{
    id: string;
    title: string;
    season: number;
    episode: number;
    description?: string;
    url: string;
    duration?: string;
    airDate?: string;
    rating?: number;
  }>;
  genres?: string[];
  year?: number;
  rating?: number;
  seasons?: number;
}

const Index = () => {
  const [urls, setUrls] = useState<StreamingUrl[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showScrapingDialog, setShowScrapingDialog] = useState(false);
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [editingUrl, setEditingUrl] = useState<StreamingUrl | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverUrl, setServerUrl] = useState('http://localhost:3001');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<StreamingUrl | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const savedServerUrl = localStorage.getItem('server-url');
    if (savedServerUrl) {
      setServerUrl(savedServerUrl);
    }
  }, []);

  const refreshFromServer = useCallback(async () => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Synchronisation nur bei Internetverbindung möglich",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);
    try {
      const response = await fetch(`${serverUrl}/api/streams`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        const serverUrls = await response.json();
        setUrls(serverUrls);
        localStorage.setItem('streaming-urls', JSON.stringify(serverUrls));
        console.log('Manual refresh successful:', serverUrls.length);
        
        toast({
          title: "Aktualisierung erfolgreich",
          description: `${serverUrls.length} Streams von Server geladen`,
        });
      } else {
        throw new Error(`Server-Fehler: ${response.status}`);
      }
    } catch (error) {
      console.error('Manual refresh failed:', error);
      toast({
        title: "Aktualisierung fehlgeschlagen",
        description: "Server ist nicht erreichbar oder antwortet nicht",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [isOnline, serverUrl, toast]);

  useEffect(() => {
    const loadUrls = async () => {
      try {
        const savedUrls = localStorage.getItem('streaming-urls');
        if (savedUrls) {
          const localUrls = JSON.parse(savedUrls);
          setUrls(localUrls);
          console.log('Loaded URLs from localStorage:', localUrls.length);
        }

        if (isOnline) {
          try {
            const response = await fetch(`${serverUrl}/api/streams`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });
            
            if (response.ok) {
              const serverUrls = await response.json();
              setUrls(serverUrls);
              localStorage.setItem('streaming-urls', JSON.stringify(serverUrls));
              console.log('Synced URLs from server:', serverUrls.length);
              
              toast({
                title: "Synchronisiert",
                description: `${serverUrls.length} Streams vom Server geladen`,
              });
            }
          } catch (serverError) {
            console.log('Server not available, using local data');
          }
        }
      } catch (error) {
        console.error('Error loading URLs:', error);
      }
    };

    loadUrls();
  }, [isOnline, serverUrl, toast]);

  const saveUrls = useCallback(async (urlsToSave: StreamingUrl[]) => {
    localStorage.setItem('streaming-urls', JSON.stringify(urlsToSave));
    
    if (isOnline) {
      try {
        await fetch(`${serverUrl}/api/streams`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(urlsToSave),
        });
        console.log('Synced URLs to server');
      } catch (error) {
        console.log('Could not sync to server, saved locally only');
      }
    }
  }, [isOnline, serverUrl]);

  useEffect(() => {
    if (urls.length > 0) {
      saveUrls(urls);
    }
  }, [urls, saveUrls]);

  const addUrl = useCallback(async (url: string) => {
    try {
      console.log('Adding URL:', url);
      
      const newUrl: StreamingUrl = {
        id: Date.now().toString(),
        url,
        title: url,
        addedAt: Date.now(),
        tags: [],
        type: 'other'
      };

      try {
        const metadata = await fetchUrlMetadata(url);
        newUrl.title = metadata.title || url;
        newUrl.description = metadata.description;
        newUrl.thumbnail = metadata.thumbnail;
        newUrl.tags = metadata.tags || [];
        newUrl.type = metadata.type || 'other';
        newUrl.genres = metadata.genres;
        newUrl.year = metadata.year;
        newUrl.rating = metadata.rating;
      } catch (metadataError) {
        console.warn('Could not fetch metadata for URL:', url, metadataError);
      }

      setUrls(prev => [...prev, newUrl]);
      toast({
        title: "URL hinzugefügt",
        description: `"${newUrl.title}" wurde zur Streaming-Liste hinzugefügt`,
      });
    } catch (error) {
      console.error('Error adding URL:', error);
      toast({
        title: "Fehler",
        description: "URL konnte nicht hinzugefügt werden. Bitte versuchen Sie es erneut.",
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
      tags: [],
      type: 'other'
    }));

    setUrls(prev => [...prev, ...newUrls]);
  }, []);

  const removeUrl = useCallback((id: string) => {
    setUrls(prev => prev.filter(url => url.id !== id));
    toast({
      title: "URL entfernt",
      description: "Streaming-Link wurde entfernt",
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

  const allCategories = Array.from(new Set(
    urls.flatMap(url => [...(url.tags || []), ...(url.genres || [])])
  )).filter(Boolean);

  const filteredUrls = selectedCategories.length > 0 
    ? urls.filter(url => 
        selectedCategories.some(cat => 
          [...(url.tags || []), ...(url.genres || [])].includes(cat)
        )
      )
    : urls;

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const fetchUrlMetadata = async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const domain = new URL(url).hostname;
      const siteName = domain.replace('www.', '').split('.')[0].toUpperCase();
      
      const tags = [];
      const genres = [];
      let type: 'movie' | 'series' | 'live' | 'other' = 'other';
      
      if (domain.includes('youtube')) {
        tags.push('YouTube', 'Video');
        type = 'live';
      }
      if (domain.includes('aniworld')) {
        tags.push('Anime', 'Series');
        genres.push('Anime', 'Animation');
        type = 'series';
      }
      if (domain.includes('netflix')) {
        tags.push('Netflix', 'Movies');
        type = 'movie';
        genres.push('Streaming');
      }
      if (domain.includes('twitch')) {
        tags.push('Twitch', 'Live');
        type = 'live';
      }
      
      return {
        title: siteName,
        description: `Stream content from ${domain}`,
        thumbnail: `https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop`,
        tags,
        genres,
        type,
        year: 2024,
        rating: Math.round((Math.random() * 4 + 6) * 10) / 10
      };
    } catch {
      return {
        title: 'Streaming Source',
        description: 'Custom streaming link',
        tags: ['Custom'],
        type: 'other' as const
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
      title: "Export abgeschlossen",
      description: "Ihre Streaming-URLs wurden exportiert",
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
          title: "Import abgeschlossen",
          description: `${importedUrls.length} Streaming-URLs importiert`,
        });
      } catch (error) {
        toast({
          title: "Import-Fehler",
          description: "Fehler beim Importieren. Bitte prüfen Sie das Dateiformat.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  if (selectedSeries) {
    return (
      <SeriesDetailView
        series={selectedSeries}
        onBack={() => setSelectedSeries(null)}
        onPlayEpisode={(episode) => window.open(episode.url, '_blank')}
      />
    );
  }

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Fire TV Streaming Hub
            </h1>
            <p className="text-slate-400 mt-1">
              Ihre persönliche Streaming-Sammlung 
              {isOnline ? (
                <span className="text-green-400 ml-2">● Online</span>
              ) : (
                <span className="text-yellow-400 ml-2">● Offline</span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={refreshFromServer}
              disabled={isRefreshing || !isOnline}
              variant="outline"
              size="sm"
              className="bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Aktualisiere...' : 'Aktualisieren'}
            </Button>
            
            <Button
              onClick={() => setShowServerSettings(true)}
              variant="outline"
              size="sm"
              className="bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              <Server className="w-4 h-4 mr-2" />
              Server
            </Button>
            
            <Button
              onClick={() => setShowScrapingDialog(true)}
              variant="outline"
              size="sm"
              className="bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Links scrapen
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
              URL hinzufügen
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Category Filter */}
          {allCategories.length > 0 && (
            <CategoryFilter
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              onClearFilters={() => setSelectedCategories([])}
            />
          )}

          {filteredUrls.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
                <Tv className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Keine Streaming-Quellen gefunden</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                {selectedCategories.length > 0 
                  ? 'Keine Inhalte für die ausgewählten Kategorien gefunden.'
                  : 'Fügen Sie Ihre liebsten Streaming-Websites hinzu oder scrapen Sie Links von Serienseiten.'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Einzelne URL hinzufügen
                </Button>
                <Button 
                  onClick={() => setShowScrapingDialog(true)}
                  variant="outline"
                  className="bg-slate-800 border-slate-600 hover:bg-slate-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Links scrapen
                </Button>
              </div>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                : "space-y-4"
            }>
              {filteredUrls.map((streamingUrl, index) => (
                <StreamingTile
                  key={streamingUrl.id}
                  url={streamingUrl}
                  onRemove={() => removeUrl(streamingUrl.id)}
                  onUpdate={(updates) => updateUrl(streamingUrl.id, updates)}
                  onEdit={() => handleEditUrl(streamingUrl)}
                  onViewSeries={() => streamingUrl.type === 'series' && setSelectedSeries(streamingUrl)}
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

        <ServerSettings
          open={showServerSettings}
          onOpenChange={setShowServerSettings}
          onServerChange={setServerUrl}
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
              title: "Alle URLs gelöscht",
              description: "Ihre Streaming-Liste wurde geleert",
            });
          }}
        />
      </div>
    </NavigationProvider>
  );
};

export default Index;
