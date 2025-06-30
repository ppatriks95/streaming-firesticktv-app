
import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FireTVWebViewProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const FireTVWebView = ({ url, title, onClose }: FireTVWebViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Fire TV Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-600 hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 mx-4">
          <h2 className="text-white font-semibold truncate">{title}</h2>
          <p className="text-slate-400 text-sm truncate">{currentUrl}</p>
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          size="sm"
          className="bg-slate-800 border-slate-600 hover:bg-slate-700"
        >
          <Home className="w-4 h-4" />
        </Button>
      </div>

      {/* WebView Container */}
      <div className="flex-1 relative bg-black">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading {title}...</p>
            </div>
          </div>
        )}
        
        {/* In a real Capacitor app, this would be replaced with a WebView */}
        <iframe
          src={currentUrl}
          className="w-full h-full border-0"
          title={title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
};
