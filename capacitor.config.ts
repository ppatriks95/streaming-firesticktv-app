
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.b472c8e3debb4a109898d2c49c9c41a1',
  appName: 'stream-tile-firestick-app',
  webDir: 'dist',
  server: {
    url: 'https://b472c8e3-debb-4a10-9898-d2c49c9c41a1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
