
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
    <div className="ml-64 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section - Netflix Style */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={series.customThumbnail || series.thumbnail || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1920&h=600&fit=crop'}
          alt={series.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Back Button */}
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="absolute top-6 left-6 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        
        {/* Series Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-5xl font-bold mb-4">{series.title}</h1>
          
          <div className="flex items-center gap-6 mb-4">
            {series.year && (
              <span className="text-lg text-gray-300">{series.year}</span>
            )}
            
            {series.rating && (
              <div className="flex items-center text-yellow-400">
                <Star className="w-5 h-5 mr-1" />
                <span className="text-lg font-semibold">{series.rating}/10</span>
              </div>
            )}
            
            {series.seasons && (
              <Badge variant="outline" className="bg-red-600 border-red-600 text-white px-3 py-1">
                {series.seasons} Staffel{series.seasons > 1 ? 'n' : ''}
              </Badge>
            )}
          </div>

          <p className="text-gray-300 text-lg max-w-3xl mb-6 leading-relaxed">
            {series.description || 'Keine Beschreibung verfügbar.'}
          </p>

          {/* Genres */}
          {(series.genres || series.tags) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {(series.genres || series.tags || []).map((genre, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-800/80 text-gray-300 px-3 py-1">
                  {genre}
                </Badge>
              ))}
            </div>
          )}

          <Button 
            onClick={() => window.open(series.url, '_blank')}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Serie öffnen
          </Button>
        </div>
      </div>

      <div className="p-8">

        {/* Season Selection */}
        {seasons.length > 1 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-white">Staffeln</h3>
            <div className="flex gap-3">
              {seasons.map((season) => (
                <Button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  variant={selectedSeason === season ? "default" : "outline"}
                  className={selectedSeason === season 
                    ? "bg-red-600 hover:bg-red-700 text-white px-6 py-2" 
                    : "bg-gray-800/50 border-gray-600 hover:bg-gray-700 text-gray-300 px-6 py-2"
                  }
                >
                  Staffel {season}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Episodes Section Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-semibold text-white">
            Staffel {selectedSeason} <span className="text-lg text-gray-400">({seasonEpisodes.length} Episoden)</span>
          </h3>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode('grid')}
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              className={viewMode === 'grid' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700 text-gray-300'
              }
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              className={viewMode === 'list' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700 text-gray-300'
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
