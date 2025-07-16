
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Calendar, Star, Tag } from 'lucide-react';
import { StreamingUrl } from '@/pages/Index';

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

        {/* Episodes List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Episoden - Staffel {selectedSeason}
          </h3>
          
          {seasonEpisodes.length > 0 ? (
            <div className="grid gap-4">
              {seasonEpisodes.map((episode) => (
                <Card key={episode.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-slate-400 min-w-[3rem]">
                        {episode.episode.toString().padStart(2, '0')}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{episode.title}</h4>
                        {episode.description && (
                          <p className="text-sm text-slate-400 line-clamp-2">{episode.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          {episode.duration && <span>⏱️ {episode.duration}</span>}
                          {episode.airDate && <span>📅 {episode.airDate}</span>}
                          {episode.rating && <span>⭐ {episode.rating}/10</span>}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => onPlayEpisode(episode)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p>Keine Episoden für Staffel {selectedSeason} gefunden.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
