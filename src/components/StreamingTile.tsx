
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Edit, Trash2, Play, Eye, Calendar, Star } from 'lucide-react';
import { StreamingUrl } from '@/pages/Index';

interface StreamingTileProps {
  url: StreamingUrl;
  onRemove: () => void;
  onUpdate: (updates: Partial<StreamingUrl>) => void;
  onEdit: () => void;
  onViewSeries?: () => void;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: () => void;
}

export const StreamingTile = ({ 
  url, 
  onRemove, 
  onEdit, 
  onViewSeries,
  viewMode, 
  isSelected, 
  onSelect 
}: StreamingTileProps) => {
  const [imageError, setImageError] = useState(false);

  const handleOpenUrl = () => {
    window.open(url.url, '_blank');
  };

  const thumbnailUrl = url.customThumbnail || url.thumbnail || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop';

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'series': return 'bg-purple-600';
      case 'movie': return 'bg-red-600';
      case 'live': return 'bg-green-600';
      default: return 'bg-slate-600';
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'series': return 'Serie';
      case 'movie': return 'Film';
      case 'live': return 'Live';
      default: return 'Andere';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card 
        className={`bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer backdrop-blur-sm ${
          isSelected ? 'ring-2 ring-red-500' : ''
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <img
              src={imageError ? 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=100&h=60&fit=crop' : thumbnailUrl}
              alt={url.title}
              className="w-16 h-10 object-cover rounded"
              onError={() => setImageError(true)}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-medium truncate">{url.title}</h3>
                <Badge className={`text-xs ${getTypeColor(url.type)} text-white`}>
                  {getTypeLabel(url.type)}
                </Badge>
              </div>
              
              <p className="text-slate-400 text-sm truncate">{url.description || url.url}</p>
              
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                {url.year && (
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {url.year}
                  </div>
                )}
                {url.rating && (
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {url.rating}/10
                  </div>
                )}
              </div>
              
              {(url.tags || url.genres) && (
                <div className="flex gap-1 mt-2">
                  {[...(url.genres || []), ...(url.tags || [])].slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {url.type === 'series' && onViewSeries && (
                <Button
                  onClick={onViewSeries}
                  size="sm"
                  variant="outline"
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={handleOpenUrl}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4" />
              </Button>
              <Button
                onClick={onEdit}
                size="sm"
                variant="outline"
                className="bg-slate-700 border-slate-600 hover:bg-slate-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                onClick={onRemove}
                size="sm"
                variant="outline"
                className="bg-slate-700 border-slate-600 hover:bg-red-600 hover:border-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`bg-gray-900/70 border-gray-800 overflow-hidden transition-all duration-300 cursor-pointer group backdrop-blur-sm ${
        isSelected ? 'ring-2 ring-red-500 scale-[1.02]' : 'hover:scale-105'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={imageError ? 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop' : thumbnailUrl}
            alt={url.title}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          
          {/* Netflix-style gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
          
          <Badge className={`absolute top-3 left-3 text-xs ${getTypeColor(url.type)} text-white border-none shadow-lg`}>
            {getTypeLabel(url.type)}
          </Badge>
          
          {/* Rating badge */}
          {url.rating && (
            <Badge className="absolute top-3 right-3 bg-yellow-600 text-white border-none shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              {url.rating}
            </Badge>
          )}
          
          {/* Play overlay with smooth animation */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300 ease-out">
              <Play className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
          </div>
          
          {/* Bottom info overlay with slide animation */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2 drop-shadow-lg">
              {url.title}
            </h3>
            
            <div className="flex items-center gap-3 text-xs text-slate-200 mb-2">
              {url.year && (
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {url.year}
                </div>
              )}
              {url.genres && url.genres.length > 0 && (
                <span className="truncate">
                  {url.genres.slice(0, 2).join(' • ')}
                </span>
              )}
            </div>
            
            {url.description && (
              <p className="text-slate-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow">
                {url.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-gray-900/80 backdrop-blur-sm">          
          {(url.tags || url.genres) && (
            <div className="flex flex-wrap gap-1 mb-3">
              {[...(url.genres || []), ...(url.tags || [])].slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            {url.type === 'series' && onViewSeries ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewSeries();
                }}
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700 transition-all duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                Episoden
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenUrl();
                }}
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
              >
                <Play className="w-4 h-4 mr-2" />
                Abspielen
              </Button>
            )}
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              size="sm"
              variant="outline"
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-all duration-200"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              size="sm"
              variant="outline"
              className="bg-slate-700 border-slate-600 hover:bg-red-600 hover:border-red-600 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
