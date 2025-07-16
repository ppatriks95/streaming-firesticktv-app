
import React from 'react';

export const AppIcon = ({ size = 512 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Gradient Background */}
    <defs>
      <radialGradient id="bg-gradient" cx="50%" cy="30%" r="70%">
        <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
        <stop offset="50%" style={{ stopColor: '#1E40AF' }} />
        <stop offset="100%" style={{ stopColor: '#0F172A' }} />
      </radialGradient>
      <linearGradient id="flame-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#DC2626' }} />
        <stop offset="30%" style={{ stopColor: '#EA580C' }} />
        <stop offset="70%" style={{ stopColor: '#F59E0B' }} />
        <stop offset="100%" style={{ stopColor: '#FEF3C7' }} />
      </linearGradient>
    </defs>

    {/* Background Circle */}
    <circle cx="256" cy="256" r="240" fill="url(#bg-gradient)" stroke="#1E293B" strokeWidth="8" />

    {/* TV Screen */}
    <rect x="156" y="180" width="200" height="140" rx="12" fill="#1E293B" stroke="#475569" strokeWidth="3" />
    <rect x="168" y="192" width="176" height="116" rx="6" fill="#0F172A" />

    {/* Flame Icon inside TV */}
    <path
      d="M256 220C248 210 240 218 236 228C232 238 236 248 244 252C248 238 256 236 264 248C272 260 280 268 284 278C288 288 284 298 276 302C284 306 294 302 298 292C302 282 298 270 292 260C286 250 278 240 270 232C264 226 260 222 256 220Z"
      fill="url(#flame-gradient)"
    />

    {/* TV Stand */}
    <rect x="236" y="320" width="40" height="20" rx="4" fill="#475569" />
    <rect x="206" y="340" width="100" height="12" rx="6" fill="#64748B" />

    {/* Streaming Lines */}
    <g opacity="0.6">
      <path d="M100 120 L140 140" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
      <path d="M120 100 L160 120" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 140 L120 160" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
      
      <path d="M412 120 L372 140" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
      <path d="M392 100 L352 120" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
      <path d="M432 140 L392 160" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Fire TV Text */}
    <text x="256" y="400" textAnchor="middle" fill="#E2E8F0" fontSize="32" fontWeight="bold" fontFamily="Arial, sans-serif">
      FIRE TV
    </text>
    <text x="256" y="430" textAnchor="middle" fill="#94A3B8" fontSize="18" fontFamily="Arial, sans-serif">
      STREAMING HUB
    </text>
  </svg>
);
