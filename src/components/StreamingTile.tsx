import { useState } from 'react';
import { ExternalLink, Trash2, Edit, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StreamingUrl } from '@/pages/Index';
import { FireTVWebView } from './FireTVWebView';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface StreamingTileProps {
  url: StreamingUrl;
  onRemove: () => void;
  onUpdate: (updates: Partial<StreamingUrl>) => void;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: () => void;
}

export const StreamingTile = ({ 
  url, 
  onRemove, 
  onUpdate, 
  viewMode, 
  isSelected, 
  onSelect 
}: StreamingTileProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  const openStream = () => {
    console.log('Opening stream in Fire TV WebView:', url.url);
    setShowWebView(true);
  };

  const closeWebView = () => {
    setShowWebView(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (showWebView) {
    return (
      <FireTVWebView
        url={url.url}
        title={url.title}
        onClose={closeWebView}
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <Card 
            className={`bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-200 cursor-pointer ${
              isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
            onClick={onSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-12 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                  {!imageError && (url.customThumbnail || url.thumbnail) ? (
                    <img
                      src={url.customThumbnail || url.thumbnail}
                      alt={url.title}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{url.title}</h3>
                  {url.description && (
                    <p className="text-sm text-slate-400 line-clamp-1">{url.description}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">Added {new Date(url.addedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      openStream();
                    }}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="bg-slate-800 border-slate-700">
          <ContextMenuItem onClick={openStream} className="hover:bg-slate-700">
            <Play className="w-4 h-4 mr-2" />
            Open Stream
          </ContextMenuItem>
          <ContextMenuItem onClick={onRemove} className="hover:bg-slate-700 text-red-400">
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card 
          className={`group bg-slate-800/30 border-slate-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden ${
            isSelected ? 'ring-2 ring-blue-500 border-blue-500 scale-105' : 'hover:scale-102'
          }`}
          onClick={onSelect}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="aspect-video relative overflow-hidden bg-slate-700">
            {!imageError && (url.customThumbnail || url.thumbnail) ? (
              <img
                src={url.customThumbnail || url.thumbnail}
                alt={url.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ExternalLink className="w-12 h-12 text-slate-400" />
              </div>
            )}
            
            {/* Overlay with play button */}
            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${
              isHovered || isSelected ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openStream();
                }}
                size="lg"
                className="bg-blue-600/90 hover:bg-blue-700 backdrop-blur-sm"
              >
                <Play className="w-6 h-6" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-1 line-clamp-1">{url.title}</h3>
            {url.description && (
              <p className="text-sm text-slate-400 line-clamp-2 mb-2">{url.description}</p>
            )}
            <p className="text-xs text-slate-500">Added {new Date(url.addedAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="bg-slate-800 border-slate-700">
        <ContextMenuItem onClick={openStream} className="hover:bg-slate-700">
          <Play className="w-4 h-4 mr-2" />
          Open Stream
        </ContextMenuItem>
        <ContextMenuItem onClick={onRemove} className="hover:bg-slate-700 text-red-400">
          <Trash2 className="w-4 h-4 mr-2" />
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
