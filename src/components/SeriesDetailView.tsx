
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Calendar, Star, Tag, Grid, List } from 'lucide-react';
import { StreamingUrl } from '@/pages/Index';
import { EpisodeTile } from './EpisodeTile';

interface Episode {
  id: string;
  title: string;
  season: number;
  episode: number;
  description?: string;
  url: string;
  duration?: string;
  airDate?: string;
  rating?: number;
}

interface SeriesDetailProps {
  series: StreamingUrl & {
    episodes?: Episode[];
    genres?: string[];
    year?: number;
    rating?: number;
    seasons?: number;
  };
  onBack: () => void;
  onPlayEpisode: (episode: Episode) => void;
}

export const SeriesDetailView = ({ series, onBack, onPlayEpisode }: SeriesDetailProps) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const episodes = series.episodes || [];
  const seasons = Array.from(new Set(episodes.map(ep => ep.season))).sort();
  const seasonEpisodes = episodes.filter(ep => ep.season === selectedSeason);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="p-6">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-6 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Übersicht
        </Button>

        {/* Series Header */}
        <div className="mb-8">
          <div className="flex gap-6 mb-4">
            <img
              src={series.customThumbnail || series.thumbnail || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=450&fit=crop'}
              alt={series.title}
              className="w-48 h-72 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{series.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                {series.year && (
                  <div className="flex items-center text-slate-300">
                    <Calendar className="w-4 h-4 mr-1" />
                    {series.year}
                  </div>
                )}
                
                {series.rating && (
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 mr-1" />
                    {series.rating}/10
                  </div>
                )}
                
                {series.seasons && (
                  <Badge variant="outline" className="bg-slate-700 border-slate-600">
                    {series.seasons} Staffel{series.seasons > 1 ? 'n' : ''}
                  </Badge>
                )}
              </div>

              <p className="text-slate-300 mb-4 leading-relaxed">
                {series.description || 'Keine Beschreibung verfügbar.'}
              </p>

              {/* Genres */}
              {(series.genres || series.tags) && (
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-wrap gap-2">
                    {(series.genres || series.tags || []).map((genre, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-300">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={() => window.open(series.url, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Serie öffnen
              </Button>
            </div>
          </div>
        </div>

        {/* Season Selection */}
        {seasons.length > 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Staffel auswählen</h3>
            <div className="flex gap-2">
              {seasons.map((season) => (
                <Button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  variant={selectedSeason === season ? "default" : "outline"}
                  className={selectedSeason === season 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-slate-700 border-slate-600 hover:bg-slate-600"
                  }
                >
                  Staffel {season}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Episodes Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            Episoden - Staffel {selectedSeason} ({seasonEpisodes.length})
          </h3>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode('grid')}
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              className={viewMode === 'grid' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
              }
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              className={viewMode === 'list' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
              }
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Episodes Grid/List */}
        {seasonEpisodes.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {seasonEpisodes.map((episode) => (
                <EpisodeTile
                  key={episode.id}
                  episode={episode}
                  onPlay={onPlayEpisode}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {seasonEpisodes.map((episode) => (
                <EpisodeTile
                  key={episode.id}
                  episode={episode}
                  onPlay={onPlayEpisode}
                  viewMode="list"
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 text-slate-400">
            <div className="text-6xl mb-4">📺</div>
            <h4 className="text-lg font-medium mb-2">Keine Episoden gefunden</h4>
            <p>Für Staffel {selectedSeason} sind keine Episoden verfügbar.</p>
          </div>
        )}
      </div>
    </div>
  );
};
