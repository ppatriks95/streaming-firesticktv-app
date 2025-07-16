
import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Home, Shield, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateAdBlockCSS } from '@/utils/adblock';

interface FireTVWebViewProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const FireTVWebView = ({ url, title, onClose }: FireTVWebViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [adBlockEnabled, setAdBlockEnabled] = useState(() => {
    return localStorage.getItem('adblock-enabled') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('adblock-enabled', adBlockEnabled.toString());
  }, [adBlockEnabled]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Inject adblock CSS when iframe loads
    if (!isLoading && adBlockEnabled) {
      const iframe = document.querySelector('#webview-iframe') as HTMLIFrameElement;
      if (iframe) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // Remove existing adblock styles
            const existingStyle = iframeDoc.querySelector('#adblock-styles');
            if (existingStyle) {
              existingStyle.remove();
            }

            // Add new adblock styles
            const style = iframeDoc.createElement('style');
            style.id = 'adblock-styles';
            style.textContent = generateAdBlockCSS();
            iframeDoc.head.appendChild(style);
          }
        } catch (error) {
          // Cross-origin restrictions might prevent access
          console.log('Cannot inject adblock styles due to cross-origin restrictions');
        }
      }
    }
  }, [isLoading, adBlockEnabled]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const toggleAdBlock = () => {
    setAdBlockEnabled(!adBlockEnabled);
    // Refresh the page to apply/remove adblock
    handleRefresh();
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
          <Button
            onClick={toggleAdBlock}
            variant={adBlockEnabled ? "default" : "outline"}
            size="sm"
            className={adBlockEnabled 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-slate-800 border-slate-600 hover:bg-slate-700"
            }
            title={adBlockEnabled ? "AdBlock aktiviert" : "AdBlock deaktiviert"}
          >
            {adBlockEnabled ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="flex-1 mx-4">
          <h2 className="text-white font-semibold truncate">{title}</h2>
          <p className="text-slate-400 text-sm truncate flex items-center gap-2">
            {currentUrl}
            {adBlockEnabled && (
              <span className="text-green-400 text-xs">• AdBlock aktiv</span>
            )}
          </p>
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
              {adBlockEnabled && (
                <p className="text-green-400 text-sm mt-2">AdBlock wird geladen...</p>
              )}
            </div>
          </div>
        )}
        
        {/* Enhanced iframe with adblock support */}
        <iframe
          id="webview-iframe"
          src={currentUrl}
          className="w-full h-full border-0"
          title={title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          style={{ display: isLoading ? 'none' : 'block' }}
          onLoad={() => {
            // Try to inject adblock styles after iframe loads
            if (adBlockEnabled) {
              setTimeout(() => {
                const iframe = document.querySelector('#webview-iframe') as HTMLIFrameElement;
                if (iframe) {
                  try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) {
                      const style = iframeDoc.createElement('style');
                      style.id = 'adblock-styles';
                      style.textContent = generateAdBlockCSS();
                      iframeDoc.head.appendChild(style);
                    }
                  } catch (error) {
                    console.log('Cannot inject adblock styles due to cross-origin restrictions');
                  }
                }
              }, 500);
            }
          }}
        />
      </div>
    </div>
  );
};
