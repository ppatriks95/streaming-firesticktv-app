
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
        className={`bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer ${
          isSelected ? 'ring-2 ring-blue-500' : ''
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
      className={`bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 scale-105' : ''
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={imageError ? 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop' : thumbnailUrl}
            alt={url.title}
            className="w-full h-32 object-cover rounded-t-lg"
            onError={() => setImageError(true)}
          />
          
          <Badge className={`absolute top-2 left-2 text-xs ${getTypeColor(url.type)} text-white`}>
            {getTypeLabel(url.type)}
          </Badge>
          
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center rounded-t-lg">
            <Play className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-medium mb-2 line-clamp-2">{url.title}</h3>
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">{url.description || url.url}</p>
          
          <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
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
            <div className="flex flex-wrap gap-1 mb-3">
              {[...(url.genres || []), ...(url.tags || [])].slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            {url.type === 'series' && onViewSeries ? (
              <Button
                onClick={onViewSeries}
                size="sm"
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Episoden
              </Button>
            ) : (
              <Button
                onClick={handleOpenUrl}
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Öffnen
              </Button>
            )}
            
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
};
