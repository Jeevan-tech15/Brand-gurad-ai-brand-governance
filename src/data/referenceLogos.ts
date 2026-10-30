import { BrandAsset } from '../types';

export const OFFICIAL_REFERENCE_LOGOS: BrandAsset[] = [
  {
    id: 'ref-logo-bg-primary',
    brand_name: 'BrandGuard AI',
    asset_name: 'BrandGuard AI Primary Shield (Emerald)',
    asset_type: 'LOGO',
    variation_type: 'PRIMARY',
    image_url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
        <rect width="100%" height="100%" fill="none"/>
        <g transform="translate(15, 15)">
          <!-- Emerald Shield Mark -->
          <rect x="0" y="0" width="90" height="90" rx="20" fill="#047857"/>
          <path d="M 45 15 L 75 27 C 75 55 45 75 45 75 C 45 75 15 55 15 27 Z" fill="#ffffff" fill-opacity="0.2"/>
          <path d="M 33 45 L 42 54 L 58 36" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>
        <!-- Brand Typography -->
        <text x="125" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="800" fill="#0f172a">BrandGuard</text>
        <rect x="315" y="36" width="38" height="24" rx="6" fill="#047857"/>
        <text x="323" y="53" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">AI</text>
        <text x="126" y="85" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#64748b" letter-spacing="1.5">MARKETING GOVERNANCE</text>
      </svg>
    `.trim())}`,
    usage_instructions: 'Official primary brand mark. Must maintain minimum 16px clear space on all sides. Do not stretch, distort, or modify colors.',
    permitted_backgrounds: ['#ffffff', '#f8fafc', '#f1f5f9'],
    clear_space_rule: 'Minimum 16px (0.05 normalized) exclusion zone on all 4 boundaries.',
    official_colors: ['#047857', '#0f172a', '#ffffff', '#64748b'],
    aspect_ratio: 3.33,
    is_approved: true,
    created_at: new Date('2026-10-01T08:00:00Z').toISOString(),
  },
  {
    id: 'ref-logo-bg-mono-dark',
    brand_name: 'BrandGuard AI',
    asset_name: 'BrandGuard AI Monochrome Dark',
    asset_type: 'LOGO',
    variation_type: 'MONOCHROME_DARK',
    image_url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
        <rect width="100%" height="100%" fill="none"/>
        <g transform="translate(15, 15)">
          <rect x="0" y="0" width="90" height="90" rx="20" fill="#0f172a"/>
          <path d="M 45 15 L 75 27 C 75 55 45 75 45 75 C 45 75 15 55 15 27 Z" fill="#ffffff" fill-opacity="0.15"/>
          <path d="M 33 45 L 42 54 L 58 36" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>
        <text x="125" y="60" font-family="system-ui, sans-serif" font-size="34" font-weight="800" fill="#0f172a">BrandGuard</text>
        <rect x="315" y="36" width="38" height="24" rx="6" fill="#0f172a"/>
        <text x="323" y="53" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">AI</text>
        <text x="126" y="85" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#475569" letter-spacing="1.5">MARKETING GOVERNANCE</text>
      </svg>
    `.trim())}`,
    usage_instructions: 'Authorized for single-color black-and-white print materials and high-contrast light backgrounds.',
    permitted_backgrounds: ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0'],
    clear_space_rule: 'Minimum 16px exclusion zone.',
    official_colors: ['#0f172a', '#ffffff'],
    aspect_ratio: 3.33,
    is_approved: true,
    created_at: new Date('2026-10-01T08:00:00Z').toISOString(),
  },
  {
    id: 'ref-logo-bg-inverted-white',
    brand_name: 'BrandGuard AI',
    asset_name: 'BrandGuard AI Inverted (Pure White)',
    asset_type: 'LOGO',
    variation_type: 'MONOCHROME_WHITE',
    image_url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
        <rect width="100%" height="100%" fill="none"/>
        <g transform="translate(15, 15)">
          <rect x="0" y="0" width="90" height="90" rx="20" fill="#ffffff"/>
          <path d="M 45 15 L 75 27 C 75 55 45 75 45 75 C 45 75 15 55 15 27 Z" fill="#047857" fill-opacity="0.2"/>
          <path d="M 33 45 L 42 54 L 58 36" stroke="#047857" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>
        <text x="125" y="60" font-family="system-ui, sans-serif" font-size="34" font-weight="800" fill="#ffffff">BrandGuard</text>
        <rect x="315" y="36" width="38" height="24" rx="6" fill="#ffffff"/>
        <text x="323" y="53" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#047857">AI</text>
        <text x="126" y="85" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#cbd5e1" letter-spacing="1.5">MARKETING GOVERNANCE</text>
      </svg>
    `.trim())}`,
    usage_instructions: 'Authorized strictly for dark backgrounds (#0f172a, #047857, or photography with >70% dark luminosity).',
    permitted_backgrounds: ['#0f172a', '#1e293b', '#047857', '#065f46'],
    clear_space_rule: 'Minimum 16px exclusion zone.',
    official_colors: ['#ffffff', '#047857', '#cbd5e1'],
    aspect_ratio: 3.33,
    is_approved: true,
    created_at: new Date('2026-10-01T08:00:00Z').toISOString(),
  },
  {
    id: 'ref-logo-apexsound-primary',
    brand_name: 'ApexSound',
    asset_name: 'ApexSound Acoustic Pro Logo',
    asset_type: 'LOGO',
    variation_type: 'PRIMARY',
    image_url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 100" width="360" height="100">
        <rect width="100%" height="100%" fill="none"/>
        <!-- Acoustic Waves Icon -->
        <g transform="translate(10, 15)">
          <circle cx="35" cy="35" r="35" fill="#4338ca"/>
          <rect x="18" y="27" width="5" height="16" rx="2.5" fill="#ffffff"/>
          <rect x="27" y="18" width="5" height="34" rx="2.5" fill="#ffffff"/>
          <rect x="36" y="10" width="5" height="50" rx="2.5" fill="#ffffff"/>
          <rect x="45" y="20" width="5" height="30" rx="2.5" fill="#ffffff"/>
          <rect x="54" y="29" width="5" height="12" rx="2.5" fill="#ffffff"/>
        </g>
        <text x="95" y="55" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#1e1b4b" letter-spacing="-0.5">APEXSOUND</text>
        <text x="96" y="76" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#6366f1" letter-spacing="2">HIGH FIDELITY AUDIO</text>
      </svg>
    `.trim())}`,
    usage_instructions: 'Official soundbar and consumer audio hardware identity. Soundwave emblem must precede wordmark horizontally.',
    permitted_backgrounds: ['#ffffff', '#f8fafc', '#0f172a'],
    clear_space_rule: 'Minimum 20px padding around emblem.',
    official_colors: ['#4338ca', '#1e1b4b', '#6366f1', '#ffffff'],
    aspect_ratio: 3.6,
    is_approved: true,
    created_at: new Date('2026-10-02T08:00:00Z').toISOString(),
  },
  {
    id: 'ref-logo-voltpulse-primary',
    brand_name: 'VoltPulse',
    asset_name: 'VoltPulse GaN Technology Logo',
    asset_type: 'LOGO',
    variation_type: 'PRIMARY',
    image_url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 100" width="340" height="100">
        <rect width="100%" height="100%" fill="none"/>
        <g transform="translate(10, 15)">
          <rect x="0" y="0" width="70" height="70" rx="16" fill="#0284c7"/>
          <!-- Lightning Bolt -->
          <polygon points="38,10 18,38 34,38 28,60 52,30 36,30" fill="#f59e0b"/>
        </g>
        <text x="95" y="55" font-family="system-ui, sans-serif" font-size="32" font-weight="800" fill="#0f172a">VoltPulse</text>
        <text x="96" y="76" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#0284c7" letter-spacing="1.5">FAST CHARGE GaN</text>
      </svg>
    `.trim())}`,
    usage_instructions: 'Official electronic power branding. GaN lightning bolt badge with amber #f59e0b bolt.',
    permitted_backgrounds: ['#ffffff', '#f8fafc', '#0f172a'],
    clear_space_rule: 'Minimum 16px exclusion zone.',
    official_colors: ['#0284c7', '#f59e0b', '#0f172a', '#ffffff'],
    aspect_ratio: 3.4,
    is_approved: true,
    created_at: new Date('2026-10-02T08:00:00Z').toISOString(),
  },
  {
    id: 'ref-logo-ecohydrate-primary',
    brand_name: 'EcoHydrate',
    asset_name: 'EcoHydrate Botanical Leaf & Droplet Logo',
    asset_type: 'LOGO',
    variation_type: 'PRIMARY',
    image_url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 100" width="340" height="100">
        <rect width="100%" height="100%" fill="none"/>
        <g transform="translate(10, 15)">
          <circle cx="35" cy="35" r="35" fill="#059669"/>
          <!-- Leaf Droplet Mark -->
          <path d="M 35 15 C 35 15 52 35 52 45 C 52 55 44 60 35 60 C 26 60 18 55 18 45 C 18 35 35 15 35 15 Z" fill="#ffffff"/>
          <path d="M 35 24 L 35 52 M 35 38 L 44 32" stroke="#059669" stroke-width="3" stroke-linecap="round"/>
        </g>
        <text x="95" y="55" font-family="system-ui, sans-serif" font-size="30" font-weight="800" fill="#064e3b">EcoHydrate</text>
        <text x="96" y="75" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#059669" letter-spacing="1.2">SUSTAINABLE THERMAL</text>
      </svg>
    `.trim())}`,
    usage_instructions: 'Official sustainable hydration logo. Emerald leaf-droplet emblem #059669.',
    permitted_backgrounds: ['#ffffff', '#f8fafc', '#ecfdf5'],
    clear_space_rule: 'Minimum 16px exclusion zone.',
    official_colors: ['#059669', '#064e3b', '#ffffff'],
    aspect_ratio: 3.4,
    is_approved: true,
    created_at: new Date('2026-10-02T08:00:00Z').toISOString(),
  },
  {
    id: 'ref-seal-bcorp',
    brand_name: 'B-Lab',
    asset_name: 'Certified B-Corporation Partner Seal',
    asset_type: 'BADGE',
    variation_type: 'PARTNER_SPONSOR',
    image_url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <rect width="100%" height="100%" fill="none"/>
        <circle cx="80" cy="80" r="72" stroke="#0f172a" stroke-width="6" fill="#ffffff"/>
        <text x="80" y="44" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#0f172a" text-anchor="middle" letter-spacing="1">CERTIFIED</text>
        <!-- B Mark -->
        <text x="80" y="105" font-family="Georgia, serif" font-size="64" font-weight="900" fill="#0f172a" text-anchor="middle">B</text>
        <line x1="45" y1="116" x2="115" y2="116" stroke="#0f172a" stroke-width="4"/>
        <text x="80" y="136" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#0f172a" text-anchor="middle" letter-spacing="1">CORP</text>
      </svg>
    `.trim())}`,
    usage_instructions: 'Authorized partner certification badge. Must not be altered, stretched, or recolored from standard black-and-white seal.',
    permitted_backgrounds: ['#ffffff', '#f8fafc', '#f1f5f9'],
    clear_space_rule: 'Minimum 16px clear space around circle boundary.',
    official_colors: ['#0f172a', '#ffffff'],
    aspect_ratio: 1.0,
    is_approved: true,
    created_at: new Date('2026-10-02T08:00:00Z').toISOString(),
  },
  {
    id: 'ref-logo-purevive-primary',
    brand_name: 'PureVive',
    asset_name: 'PureVive Dermatological Skincare Emblem',
    asset_type: 'LOGO',
    variation_type: 'PRIMARY',
    image_url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 100" width="360" height="100">
        <rect width="100%" height="100%" fill="none"/>
        <g transform="translate(12, 15)">
          <rect x="0" y="0" width="70" height="70" rx="20" fill="#15803d"/>
          <!-- Botanical Cross -->
          <rect x="30" y="16" width="10" height="38" rx="5" fill="#ffffff"/>
          <rect x="16" y="30" width="38" height="10" rx="5" fill="#ffffff"/>
        </g>
        <text x="96" y="55" font-family="system-ui, sans-serif" font-size="30" font-weight="800" fill="#14532d">PureVive</text>
        <text x="97" y="75" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#15803d" letter-spacing="1.5">CLINICAL BOTANICALS</text>
      </svg>
    `.trim())}`,
    usage_instructions: 'Official PureVive clinical skincare identity. Rose/Forest green #15803d with balanced medical cross.',
    permitted_backgrounds: ['#ffffff', '#f8fafc', '#f0fdf4'],
    clear_space_rule: 'Minimum 16px clear space.',
    official_colors: ['#15803d', '#14532d', '#ffffff'],
    aspect_ratio: 3.6,
    is_approved: true,
    created_at: new Date('2026-10-02T08:00:00Z').toISOString(),
  },
  {
    id: 'ref-partner-dolby-atmos',
    brand_name: 'Dolby',
    asset_name: 'Dolby Atmos Authorized Audio Partner Mark',
    asset_type: 'BADGE',
    variation_type: 'PARTNER_SPONSOR',
    image_url: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 80" width="280" height="80">
        <rect width="100%" height="100%" fill="#0f172a" rx="12"/>
        <!-- Double D Mark -->
        <g transform="translate(18, 18)">
          <path d="M 0 0 L 15 0 C 26 0 32 8 32 22 C 32 36 26 44 15 44 L 0 44 Z" fill="#ffffff"/>
          <path d="M 12 11 L 15 11 C 19 11 21 15 21 22 C 21 29 19 33 15 33 L 12 33 Z" fill="#0f172a"/>
          <path d="M 68 0 L 53 0 C 42 0 36 8 36 22 C 36 36 42 44 53 44 L 68 44 Z" fill="#ffffff"/>
          <path d="M 56 11 L 53 11 C 49 11 47 15 47 22 C 47 29 49 33 53 33 L 56 33 Z" fill="#0f172a"/>
        </g>
        <text x="100" y="44" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#ffffff" letter-spacing="2">ATMOS</text>
        <text x="100" y="62" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="#94a3b8" letter-spacing="1.5">CERTIFIED PARTNER</text>
      </svg>
    `.trim())}`,
    usage_instructions: 'Authorized partner emblem for ApexSound audio hardware. Must be rendered with official double-D emblem on high-contrast dark field.',
    permitted_backgrounds: ['#0f172a', '#1e293b'],
    clear_space_rule: 'Minimum 12px clear space.',
    official_colors: ['#0f172a', '#ffffff', '#94a3b8'],
    aspect_ratio: 3.5,
    is_approved: true,
    created_at: new Date('2026-10-02T08:00:00Z').toISOString(),
  },
];
