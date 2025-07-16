
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Server, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServerSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServerChange: (serverUrl: string) => void;
}

export const ServerSettings = ({ open, onOpenChange, onServerChange }: ServerSettingsProps) => {
  const [serverUrl, setServerUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    const savedServerUrl = localStorage.getItem('server-url') || 'http://localhost:3001';
    setServerUrl(savedServerUrl);
  }, []);

  const testConnection = async () => {
    if (!serverUrl) return;
    
    setIsConnecting(true);
    setConnectionStatus('idle');
    
    try {
      const response = await fetch(`${serverUrl}/api/streams`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setConnectionStatus('success');
        toast({
          title: "Verbindung erfolgreich",
          description: "Server ist erreichbar und antwortet",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Verbindung fehlgeschlagen",
          description: `Server antwortet mit Fehler: ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Verbindung fehlgeschlagen",
        description: "Server ist nicht erreichbar",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('server-url', serverUrl);
    onServerChange(serverUrl);
    onOpenChange(false);
    toast({
      title: "Einstellungen gespeichert",
      description: "Server-Adresse wurde aktualisiert",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Server-Einstellungen
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="serverUrl">Server-Adresse</Label>
            <Input
              id="serverUrl"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="http://localhost:3001"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={testConnection}
              disabled={isConnecting || !serverUrl}
              variant="outline"
              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              {isConnecting ? 'Teste...' : 'Verbindung testen'}
            </Button>
            
            {connectionStatus === 'success' && (
              <div className="flex items-center text-green-400">
                <Check className="w-4 h-4 mr-1" />
                Verbunden
              </div>
            )}
            
            {connectionStatus === 'error' && (
              <div className="flex items-center text-red-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                Fehler
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={saveSettings} className="bg-blue-600 hover:bg-blue-700">
              Speichern
            </Button>
            <Button 
              onClick={() => onOpenChange(false)} 
              variant="outline"
              className="bg-slate-700 border-slate-600 hover:bg-slate-600"
            >
              Abbrechen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
