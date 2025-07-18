import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Calendar, Star, Clock } from 'lucide-react';

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
  thumbnail?: string;
}

interface EpisodeTileProps {
  episode: Episode;
  onPlay: (episode: Episode) => void;
  viewMode?: 'grid' | 'list';
}

export const EpisodeTile = ({ episode, onPlay, viewMode = 'grid' }: EpisodeTileProps) => {
  const [imageError, setImageError] = useState(false);
  const thumbnailUrl = episode.thumbnail || `https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop&v=${episode.id}`;

  if (viewMode === 'list') {
    return (
      <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-300 group">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={imageError ? 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=100&h=60&fit=crop' : thumbnailUrl}
                alt={episode.title}
                className="w-20 h-12 object-cover rounded transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded">
                <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-blue-600 text-white border-blue-600 text-xs">
                  S{episode.season}E{episode.episode.toString().padStart(2, '0')}
                </Badge>
                <h4 className="font-medium text-white truncate">{episode.title}</h4>
              </div>
              
              {episode.description && (
                <p className="text-slate-400 text-sm line-clamp-2 mb-2">{episode.description}</p>
              )}
              
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {episode.duration && (
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {episode.duration}
                  </div>
                )}
                {episode.airDate && (
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {episode.airDate}
                  </div>
                )}
                {episode.rating && (
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {episode.rating}/10
                  </div>
                )}
              </div>
            </div>
            
            <Button
              onClick={() => onPlay(episode)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 opacity-80 group-hover:opacity-100 transition-opacity"
            >
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700 hover:scale-105 transition-all duration-300 group cursor-pointer overflow-hidden">
      <CardContent className="p-0">
        <div className="relative" onClick={() => onPlay(episode)}>
          <img
            src={imageError ? 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop' : thumbnailUrl}
            alt={episode.title}
            className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          
          {/* Netflix-style gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
          
          {/* Episode badge */}
          <Badge className="absolute top-3 left-3 bg-blue-600 text-white border-none">
            S{episode.season}E{episode.episode.toString().padStart(2, '0')}
          </Badge>
          
          {/* Rating badge */}
          {episode.rating && (
            <Badge className="absolute top-3 right-3 bg-yellow-600 text-white border-none">
              <Star className="w-3 h-3 mr-1" />
              {episode.rating}
            </Badge>
          )}
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-12 h-12 text-white" />
            </div>
          </div>
          
          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h4 className="font-semibold text-white text-lg mb-1 line-clamp-2">{episode.title}</h4>
            
            <div className="flex items-center gap-3 text-xs text-slate-300 mb-2">
              {episode.duration && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {episode.duration}
                </div>
              )}
              {episode.airDate && (
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {episode.airDate}
                </div>
              )}
            </div>
            
            {episode.description && (
              <p className="text-slate-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {episode.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};