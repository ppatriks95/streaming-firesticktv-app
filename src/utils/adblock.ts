
// Simple adblock utility for blocking common ad domains and scripts
export const adBlockFilters = [
  // Common ad domains
  'googleads.g.doubleclick.net',
  'googlesyndication.com',
  'amazon-adsystem.com',
  'adsystem.amazon.com',
  'ads.yahoo.com',
  'adsystem.yahoo.com',
  'ads.twitter.com',
  'ads.facebook.com',
  'outbrain.com',
  'taboola.com',
  'adskeeper.com',
  'mgid.com',
  'revcontent.com',
  'zergnet.com',
  'popads.net',
  'popcash.net',
  'propellerads.com',
  'adnxs.com',
  'adsystem.com',
  'ad-delivery.net',
  'advertising.com',
  'adsrvr.org',
  'adform.net',
  'adroll.com',
  'adsymptotic.com',
  'criteo.com',
  'rubiconproject.com',
  'pubmatic.com',
  'openx.net',
  'contextweb.com',
  'rlcdn.com',
  'smartadserver.com',
  'yieldmo.com',
  'exponential.com',
  'adsystem.yahoo.com'
];

export const adBlockKeywords = [
  'advertisement',
  'banner',
  'popup',
  'overlay',
  'interstitial',
  'preroll',
  'midroll',
  'postroll',
  'sidebar-ad',
  'top-ad',
  'bottom-ad',
  'ad-container',
  'ad-wrapper',
  'sponsored',
  'promotion'
];

export const generateAdBlockCSS = () => {
  const adSelectors = [
    // Common ad class names and IDs
    '[class*="ad-"]',
    '[class*="ads-"]',
    '[class*="advertisement"]',
    '[class*="banner"]',
    '[class*="popup"]',
    '[class*="overlay"]',
    '[class*="sponsored"]',
    '[id*="ad-"]',
    '[id*="ads-"]',
    '[id*="advertisement"]',
    '[id*="banner"]',
    '[id*="popup"]',
    '[id*="overlay"]',
    '[id*="sponsored"]',
    // Specific ad networks
    '.google-ad',
    '.adsbygoogle',
    '.amazon-ad',
    '.outbrain',
    '.taboola',
    '.mgid',
    '.revcontent',
    // Video ads
    '.video-ads',
    '.preroll',
    '.midroll',
    '.postroll',
    // Social media ads
    '.promoted-tweet',
    '.sponsored-post',
    '.fb-ad',
    // Generic hiding
    'iframe[src*="ads"]',
    'iframe[src*="doubleclick"]',
    'iframe[src*="googlesyndication"]',
    'script[src*="ads"]',
    'script[src*="doubleclick"]',
    'script[src*="googlesyndication"]'
  ];

  return `
    ${adSelectors.join(', ')} {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      position: absolute !important;
      left: -9999px !important;
    }
    
    /* Hide common popup overlays */
    div[style*="position: fixed"],
    div[style*="position: absolute"] {
      pointer-events: auto !important;
    }
    
    /* Remove annoying animations */
    * {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
    }
  `;
};

export const isAdUrl = (url: string): boolean => {
  const domain = url.toLowerCase();
  return adBlockFilters.some(filter => domain.includes(filter.toLowerCase()));
};
