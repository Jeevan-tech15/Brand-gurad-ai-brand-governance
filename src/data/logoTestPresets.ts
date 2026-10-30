// Test scenarios for BrandGuard AI Logo Detection and Verification Engine

export interface LogoTestScenario {
  id: string;
  name: string;
  description: string;
  title: string;
  contentType: string;
  caption: string;
  svgDataUrl: string;
  expectedLogoFindings: string[];
}

// 1. Exact Official Logo (Clean & Compliant)
const officialLogoSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>

  <!-- EXACT APPROVED BRANDGUARD AI LOGO (Top-Left with proper padding) -->
  <g id="official-logo" transform="translate(60, 50)">
    <rect x="0" y="0" width="70" height="70" rx="16" fill="#047857"/>
    <path d="M 35 12 L 58 21 C 58 42 35 58 35 58 C 35 58 12 42 12 21 Z" fill="#ffffff" fill-opacity="0.2"/>
    <path d="M 26 35 L 33 42 L 46 28" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <text x="88" y="45" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#0f172a">BrandGuard</text>
    <rect x="245" y="26" width="34" height="20" rx="5" fill="#047857"/>
    <text x="252" y="40" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">AI</text>
    <text x="89" y="65" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#64748b" letter-spacing="1">MARKETING GOVERNANCE</text>
  </g>

  <!-- Content -->
  <text x="60" y="240" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="#0f172a">Enterprise Brand Protection</text>
  <text x="60" y="290" font-family="system-ui, sans-serif" font-size="18" fill="#475569">Continuous automated compliance monitoring across all channels.</text>

  <!-- Feature Card -->
  <rect x="60" y="340" width="680" height="280" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <rect x="90" y="380" width="60" height="60" rx="14" fill="#ecfdf5"/>
  <text x="170" y="415" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#0f172a">Authorized Logo Clearance</text>
  <text x="170" y="445" font-family="system-ui, sans-serif" font-size="14" fill="#64748b">Verified against official high-resolution vector brand assets.</text>

  <!-- CTA Button -->
  <rect x="60" y="660" width="240" height="54" rx="14" fill="#047857"/>
  <text x="180" y="694" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">Request Demo</text>
</svg>
`.trim())}`;

// 2. Stretched / Distorted Logo
const stretchedLogoSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#ffffff"/>

  <!-- STRETCHED / DISTORTED LOGO (Scale X=2.2, Scale Y=0.7) -->
  <g id="stretched-logo" transform="translate(60, 60) scale(2.2, 0.65)">
    <rect x="0" y="0" width="70" height="70" rx="16" fill="#047857"/>
    <path d="M 26 35 L 33 42 L 46 28" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
    <text x="88" y="45" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#0f172a">BrandGuard</text>
    <rect x="245" y="26" width="34" height="20" rx="5" fill="#047857"/>
    <text x="252" y="40" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">AI</text>
  </g>

  <text x="60" y="240" font-family="system-ui, sans-serif" font-size="40" font-weight="800" fill="#0f172a">Special Partner Promotion</text>
  <text x="60" y="280" font-family="system-ui, sans-serif" font-size="16" fill="#64748b">Join thousands of marketing teams ensuring brand compliance.</text>
  <rect x="60" y="320" width="680" height="360" rx="16" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="100" y="480" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="#0f172a">Automated Creative Verification</text>
</svg>
`.trim())}`;

// 3. Incorrect Logo Color (Off-palette Red #ef4444 instead of Emerald #047857)
const wrongColorLogoSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#f8fafc"/>

  <!-- UNAPPROVED RED COLOR LOGO (#ef4444 instead of official emerald #047857) -->
  <g id="wrong-color-logo" transform="translate(60, 50)">
    <rect x="0" y="0" width="70" height="70" rx="16" fill="#ef4444"/>
    <path d="M 35 12 L 58 21 C 58 42 35 58 35 58 C 35 58 12 42 12 21 Z" fill="#ffffff" fill-opacity="0.2"/>
    <path d="M 26 35 L 33 42 L 46 28" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
    <text x="88" y="45" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#ef4444">BrandGuard</text>
    <rect x="245" y="26" width="34" height="20" rx="5" fill="#ef4444"/>
    <text x="252" y="40" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">AI</text>
  </g>

  <text x="60" y="220" font-family="system-ui, sans-serif" font-size="38" font-weight="900" fill="#0f172a">Flash Campaign Sale</text>
  <rect x="60" y="280" width="680" height="380" rx="20" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="100" y="450" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#0f172a">Year-End Enterprise License</text>
</svg>
`.trim())}`;

// 4. Partially Cropped Logo (Positioned with x="-40", cutting off half the shield mark)
const croppedLogoSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#ffffff"/>

  <!-- CROPPED LOGO (Negative X position cutting off left edge) -->
  <g id="cropped-logo" transform="translate(-35, 50)">
    <rect x="0" y="0" width="70" height="70" rx="16" fill="#047857"/>
    <path d="M 26 35 L 33 42 L 46 28" stroke="#ffffff" stroke-width="5" stroke-linecap="round" fill="none"/>
    <text x="88" y="45" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#0f172a">BrandGuard</text>
    <rect x="245" y="26" width="34" height="20" rx="5" fill="#047857"/>
    <text x="252" y="40" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">AI</text>
  </g>

  <text x="60" y="230" font-family="system-ui, sans-serif" font-size="38" font-weight="800" fill="#0f172a">Global Innovation Summit</text>
  <rect x="60" y="290" width="680" height="380" rx="16" fill="#f8fafc" stroke="#cbd5e1"/>
</svg>
`.trim())}`;

// 5. Very Small Logo / Low Visibility (Width < 28px)
const smallLogoSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#ffffff"/>

  <!-- VERY SMALL LOGO (Scale 0.28, width < 28px) in footer corner -->
  <g id="small-logo" transform="translate(680, 740) scale(0.28)">
    <rect x="0" y="0" width="70" height="70" rx="16" fill="#047857"/>
    <text x="88" y="45" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#0f172a">BrandGuard</text>
  </g>

  <text x="60" y="160" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="#0f172a">Apex UltraSound Q4 Launch</text>
  <rect x="60" y="220" width="680" height="460" rx="20" fill="#f1f5f9"/>
  <text x="100" y="420" font-family="system-ui, sans-serif" font-size="26" font-weight="700" fill="#334155">Acoustic Precision Reimagined</text>
</svg>
`.trim())}`;

// 6. Ad with No Logo
const noLogoSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#f8fafc"/>
  <text x="60" y="200" font-family="system-ui, sans-serif" font-size="42" font-weight="800" fill="#0f172a">Autumn Photography Workshop</text>
  <text x="60" y="250" font-family="system-ui, sans-serif" font-size="18" fill="#64748b">Learn composition, natural lighting, and color grading from industry masters.</text>
  <rect x="60" y="300" width="680" height="380" rx="20" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="100" y="460" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="#1e293b">Session starts November 12. Registration open to all enthusiasts.</text>
</svg>
`.trim())}`;

// 7. Ad with Multiple Partner Logos (ApexSound primary + Dolby Atmos approved partner + unapproved medical badge)
const multiPartnerLogosSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <rect width="800" height="800" fill="#0f172a"/>

  <!-- 1. ApexSound Primary Logo (Top-Left) -->
  <g id="apex-logo" transform="translate(60, 50)">
    <circle cx="28" cy="28" r="28" fill="#4338ca"/>
    <rect x="14" y="22" width="4" height="12" rx="2" fill="#ffffff"/>
    <rect x="22" y="15" width="4" height="26" rx="2" fill="#ffffff"/>
    <rect x="30" y="9" width="4" height="38" rx="2" fill="#ffffff"/>
    <rect x="38" y="17" width="4" height="22" rx="2" fill="#ffffff"/>
    <text x="70" y="38" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#ffffff">APEXSOUND</text>
  </g>

  <!-- 2. Authorized Dolby Atmos Partner Logo (Top-Right) -->
  <g id="dolby-partner-logo" transform="translate(540, 50)">
    <rect width="200" height="56" rx="10" fill="#1e293b" stroke="#334155"/>
    <text x="25" y="35" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#ffffff">DD</text>
    <text x="65" y="34" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#ffffff">ATMOS</text>
    <text x="65" y="47" font-family="system-ui, sans-serif" font-size="8" font-weight="700" fill="#94a3b8">AUTHORIZED</text>
  </g>

  <!-- Headline -->
  <text x="60" y="240" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="#ffffff">Spatial Cinema Soundbar Pro</text>
  <text x="60" y="285" font-family="system-ui, sans-serif" font-size="18" fill="#94a3b8">True 7.1.4 multi-channel acoustic immersion for home theaters.</text>

  <!-- Main Product Render Area -->
  <rect x="60" y="330" width="680" height="300" rx="20" fill="#1e293b" stroke="#334155"/>
  <text x="100" y="490" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#ffffff">Includes ApexSound 1-Year Limited Warranty</text>

  <!-- 3. Unapproved Medical Endorsement Stamp (Bottom Right) -->
  <g id="unapproved-seal" transform="translate(520, 660)">
    <circle cx="50" cy="50" r="44" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>
    <text x="50" y="35" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#ef4444" text-anchor="middle">DERMATOLOGIST</text>
    <text x="50" y="55" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#ef4444" text-anchor="middle">APPROVED</text>
    <text x="50" y="72" font-family="system-ui, sans-serif" font-size="8" font-weight="bold" fill="#ef4444" text-anchor="middle">CLINICAL</text>
  </g>
</svg>
`.trim())}`;

export const LOGO_TEST_SCENARIOS: LogoTestScenario[] = [
  {
    id: 'test-logo-exact-official',
    name: '1. Exact Official Logo (Clean & Compliant)',
    description: 'Marketing creative containing the exact approved BrandGuard AI emerald shield mark with proper spacing.',
    title: 'BrandGuard AI Enterprise Governance Showcase',
    contentType: 'Promotional Banner (Web / Display)',
    caption: 'Discover continuous marketing creative compliance with BrandGuard AI. Schedule an enterprise audit.',
    svgDataUrl: officialLogoSvg,
    expectedLogoFindings: ['COMPLIANT'],
  },
  {
    id: 'test-logo-stretched',
    name: '2. Stretched & Distorted Logo Proportions',
    description: 'Ad where the official brand logo has been scaled with distorted aspect ratio (X=2.2, Y=0.65).',
    title: 'Partner Showcase: Distorted Brand Mark',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: 'Join the global network of brands using our automated verification platform.',
    svgDataUrl: stretchedLogoSvg,
    expectedLogoFindings: ['STRETCHED'],
  },
  {
    id: 'test-logo-wrong-color',
    name: '3. Incorrect / Off-Palette Logo Color',
    description: 'Ad with an unauthorized red (#ef4444) version of the BrandGuard logo instead of official emerald (#047857).',
    title: 'Flash Sale: Unapproved Red Logo Color',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: 'Limited time flash sale on annual compliance monitoring licenses.',
    svgDataUrl: wrongColorLogoSvg,
    expectedLogoFindings: ['WRONG_COLOR'],
  },
  {
    id: 'test-logo-cropped',
    name: '4. Partially Cropped Logo',
    description: 'Ad with the brand mark placed off-canvas, cutting off the left portion of the shield.',
    title: 'Innovation Summit: Off-Canvas Logo Placement',
    contentType: 'Promotional Banner (Web / Display)',
    caption: 'Register today for the annual marketing governance summit.',
    svgDataUrl: croppedLogoSvg,
    expectedLogoFindings: ['CROPPED'],
  },
  {
    id: 'test-logo-small-visibility',
    name: '5. Very Small Logo / Low Visibility',
    description: 'Ad with the logo scaled down to an unreadable 28px in the bottom corner.',
    title: 'Launch Banner: Low Visibility Logo Badge',
    contentType: 'Promotional Banner (Web / Display)',
    caption: 'ApexSound high-fidelity audio systems available at authorized electronics retailers.',
    svgDataUrl: smallLogoSvg,
    expectedLogoFindings: ['LOW_CONTRAST'],
  },
  {
    id: 'test-logo-no-logo',
    name: '6. Advertisement with No Logo (No False Positives)',
    description: 'Generic workshop promotion containing no brand logos; engine must not generate false positive logo errors.',
    title: 'Autumn Photography Workshop Banner',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: 'Master natural lighting and color grading this autumn. Session starts November 12.',
    svgDataUrl: noLogoSvg,
    expectedLogoFindings: [],
  },
  {
    id: 'test-logo-multiple-partners',
    name: '7. Multiple Partner Logos (Authorized & Unapproved)',
    description: 'Ad featuring ApexSound primary logo, Dolby Atmos certified partner mark, and an unapproved medical badge.',
    title: 'Cinema Soundbar: Multi-Partner Badge Verification',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: 'Experience true 7.1.4 Dolby Atmos cinema sound. Includes standard 1-Year manufacturer warranty.',
    svgDataUrl: multiPartnerLogosSvg,
    expectedLogoFindings: ['UNAPPROVED_BADGE', 'MULTI_LOGO'],
  },
];
