import { PresetScenario } from '../types';

function createSvgDataUrl(width: number, height: number, svgContent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'discount-conflict',
    name: 'Discount Contradiction (50% Image vs 70% Caption)',
    category: 'Violations Demo',
    title: 'Autumn Mega Sale - Instagram Feed',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: '🎉 UNBEATABLE SAVINGS! Get massive 70% OFF storewide this weekend only on all audio gear with code AUTUMN70. Free expedited shipping on all orders over $50!',
    imageDescription: 'Promotional ad banner showing premium wireless headphones with bold text "50% OFF ALL AUDIO GEAR" and coupon code "FALL50"',
    expectedFindings: [
      'Discount contradiction: Graphic states 50% OFF while caption claims 70% OFF',
      'Coupon code mismatch: Image displays FALL50 while caption references AUTUMN70',
      'Unsubstantiated free shipping claim without terms qualification'
    ],
    svgDataUrl: createSvgDataUrl(
      800,
      800,
      `
      <defs>
        <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#059669" />
          <stop offset="100%" stop-color="#10b981" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bg1)" />
      <circle cx="650" cy="150" r="220" fill="#059669" opacity="0.15" />
      <rect x="60" y="60" width="160" height="40" rx="8" fill="url(#accent)" />
      <text x="80" y="86" font-family="system-ui, sans-serif" font-weight="bold" font-size="18" fill="#ffffff">BRANDGUARD</text>
      
      <text x="60" y="240" font-family="system-ui, sans-serif" font-weight="900" font-size="52" fill="#ffffff">AUTUMN SALE</text>
      <text x="60" y="310" font-family="system-ui, sans-serif" font-weight="800" font-size="64" fill="#34d399">50% OFF</text>
      <text x="60" y="370" font-family="system-ui, sans-serif" font-weight="600" font-size="32" fill="#94a3b8">ALL AUDIO GEAR</text>

      <rect x="60" y="440" width="360" height="70" rx="12" fill="#334155" />
      <text x="85" y="484" font-family="system-ui, sans-serif" font-weight="bold" font-size="22" fill="#f8fafc">USE CODE: FALL50</text>

      <!-- Headphone Graphic illustration -->
      <g transform="translate(480, 360)">
        <circle cx="120" cy="120" r="140" fill="#1e293b" stroke="#334155" stroke-width="4" />
        <path d="M50 140 A80 80 0 0 1 190 140" fill="none" stroke="#10b981" stroke-width="14" stroke-linecap="round" />
        <rect x="35" y="120" width="30" height="60" rx="10" fill="#34d399" />
        <rect x="175" y="120" width="30" height="60" rx="10" fill="#34d399" />
      </g>

      <text x="60" y="730" font-family="system-ui, sans-serif" font-size="14" fill="#64748b">*Terms apply. Valid until Oct 31, 2026. Limit 1 per household.</text>
      `
    )
  },
  {
    id: 'warranty-mismatch',
    name: 'Warranty Inconsistency (1-Year Image vs 5-Year Caption)',
    category: 'Violations Demo',
    title: 'ApexSound Soundbar Pro - Product Launch',
    contentType: 'Product Advertisement (Feed / Story)',
    caption: 'Engineered for true audiophiles. The ApexSound Soundbar Pro delivers cinematic Dolby Atmos audio. Backed by our signature 5-Year Comprehensive Replacement Warranty for total peace of mind!',
    imageDescription: 'Product promotional poster displaying premium soundbar unit with official warranty badge reading "Includes 1-Year Limited Warranty"',
    expectedFindings: [
      'Warranty discrepancy: Visual badge certifies 1-Year Limited Warranty while caption promises 5-Year Comprehensive Warranty',
      'Corporate Fact Breach: Approved Fact #WF-02 mandates standard 12-month manufacturer warranty on ApexSound models'
    ],
    svgDataUrl: createSvgDataUrl(
      800,
      800,
      `
      <rect width="800" height="800" fill="#0b1329" />
      <text x="60" y="100" font-family="system-ui, sans-serif" font-weight="bold" font-size="26" fill="#38bdf8">APEXSOUND PRO</text>
      <text x="60" y="220" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#ffffff">IMMERSIVE DOLBY ATMOS</text>
      <text x="60" y="270" font-family="system-ui, sans-serif" font-weight="500" font-size="22" fill="#94a3b8">Cinematic 7.1.2 Studio Sound System</text>

      <!-- Soundbar illustration -->
      <rect x="80" y="380" width="640" height="80" rx="16" fill="#1e293b" stroke="#38bdf8" stroke-width="3" />
      <circle cx="160" cy="420" r="18" fill="#0f172a" />
      <circle cx="240" cy="420" r="18" fill="#0f172a" />
      <circle cx="560" cy="420" r="18" fill="#0f172a" />
      <circle cx="640" cy="420" r="18" fill="#0f172a" />

      <!-- Official Warranty Badge -->
      <rect x="60" y="540" width="320" height="90" rx="14" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
      <text x="85" y="580" font-family="system-ui, sans-serif" font-weight="bold" font-size="20" fill="#f59e0b">★ 1-YEAR LIMITED WARRANTY</text>
      <text x="85" y="608" font-family="system-ui, sans-serif" font-size="14" fill="#cbd5e1">Official Manufacturer Coverage Included</text>

      <text x="60" y="740" font-family="system-ui, sans-serif" font-size="14" fill="#64748b">Dolby Atmos is a registered trademark of Dolby Laboratories.</text>
      `
    )
  },
  {
    id: 'spelling-and-dates',
    name: 'Spelling Error & Date Contradiction',
    category: 'Violations Demo',
    title: 'Flash Holiday Clearance - Digital Banner',
    contentType: 'Promotional Banner (Web / Display)',
    caption: 'Our annual holiday blow-out sale continues through November 30! Don’t miss your chance for high-performance computing at rock bottom prices.',
    imageDescription: 'Promo banner with visible headline spelling error "GURANTEED HIGH PERFOMANCE" and expiration footer reading "Offer ends October 15, 2026"',
    expectedFindings: [
      'Visible headline spelling error: "GURANTEED" should be "GUARANTEED" and "PERFOMANCE" should be "PERFORMANCE"',
      'Promotional expiration conflict: Image specifies October 15, 2026 while caption extends offer through November 30'
    ],
    svgDataUrl: createSvgDataUrl(
      800,
      800,
      `
      <rect width="800" height="800" fill="#18181b" />
      <rect x="40" y="40" width="720" height="720" rx="20" fill="#27272a" stroke="#ef4444" stroke-width="3" />
      
      <text x="80" y="140" font-family="system-ui, sans-serif" font-weight="900" font-size="38" fill="#ef4444">SPECIAL FLASH OFFER</text>
      
      <!-- Typo in visible text -->
      <text x="80" y="240" font-family="system-ui, sans-serif" font-weight="800" font-size="34" fill="#ffffff">GURANTEED HIGH PERFOMANCE</text>
      <text x="80" y="300" font-family="system-ui, sans-serif" font-weight="600" font-size="24" fill="#a1a1aa">Next-Gen Quantum Workstations</text>

      <rect x="80" y="380" width="280" height="80" rx="10" fill="#ef4444" />
      <text x="120" y="430" font-family="system-ui, sans-serif" font-weight="bold" font-size="28" fill="#ffffff">SAVE $400 NOW</text>

      <line x1="80" y1="560" x2="720" y2="560" stroke="#3f3f46" stroke-width="2" />
      
      <!-- Date mismatch in footer -->
      <text x="80" y="620" font-family="system-ui, sans-serif" font-weight="bold" font-size="22" fill="#facc15">OFFER ENDS: OCTOBER 15, 2026</text>
      <text x="80" y="660" font-family="system-ui, sans-serif" font-size="14" fill="#71717a">Strictly while supplies last. No rain checks available.</text>
      `
    )
  },
  {
    id: 'specs-mismatch',
    name: 'Tech Spec Mismatch (65W Charger vs 100W Claim)',
    category: 'Violations Demo',
    title: 'VoltPulse GaN Fast Charger Campaign',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: 'Experience hyper-speed charging. The VoltPulse GaN Charger pumps out 100W multi-device power so you can top up your laptop in under 45 minutes.',
    imageDescription: 'Product render clearly displaying packaging with "65W ULTRA-COMPACT GaN CHARGER" printed on the chassis',
    expectedFindings: [
      'Product Specification Mismatch: Packaging visibly states 65W, contradicting caption claim of 100W power output',
      'Misleading speed claim: 45-minute laptop charging requires certified 100W delivery not supported by 65W hardware'
    ],
    svgDataUrl: createSvgDataUrl(
      800,
      800,
      `
      <rect width="800" height="800" fill="#090d16" />
      <circle cx="400" cy="380" r="260" fill="#1e1b4b" opacity="0.6" />
      <text x="70" y="100" font-family="system-ui, sans-serif" font-weight="bold" font-size="28" fill="#60a5fa">VOLTPULSE POWER</text>
      <text x="70" y="160" font-family="system-ui, sans-serif" font-weight="900" font-size="46" fill="#ffffff">NEXT-GEN CHARGING</text>

      <!-- Charger Box Render -->
      <rect x="250" y="260" width="300" height="300" rx="24" fill="#1e293b" stroke="#38bdf8" stroke-width="4" />
      <rect x="360" y="210" width="80" height="50" rx="8" fill="#64748b" />
      
      <text x="290" y="380" font-family="system-ui, sans-serif" font-weight="900" font-size="48" fill="#38bdf8">65W</text>
      <text x="290" y="420" font-family="system-ui, sans-serif" font-weight="bold" font-size="18" fill="#f8fafc">ULTRA-COMPACT GaN</text>
      <text x="290" y="450" font-family="system-ui, sans-serif" font-size="14" fill="#94a3b8">Model VP-65G · USB-C PD 3.0</text>

      <text x="70" y="700" font-family="system-ui, sans-serif" font-size="15" fill="#64748b">Verified by TÜV Rheinland safety compliance standards.</text>
      `
    )
  },
  {
    id: 'compliant-creative',
    name: '100% Compliant Post (EcoHydrate Pro)',
    category: 'Compliant Reference',
    title: 'EcoHydrate Pro Bottle - Spring Sustainability Drive',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: 'Meet the EcoHydrate Pro: 100% BPA-free recycled stainless steel that keeps beverages cold for 24 hours. Includes our standard 2-year manufacturer warranty. Learn more at brandguard.com/ecohydrate.',
    imageDescription: 'Clean, brand-compliant creative with verified claims: 24-hr cold guarantee, BPA-free certification, 2-year warranty badge, and mandatory disclaimer footer',
    expectedFindings: [],
    svgDataUrl: createSvgDataUrl(
      800,
      800,
      `
      <defs>
        <linearGradient id="bgComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064e3b" />
          <stop offset="100%" stop-color="#022c22" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bgComp)" />
      
      <!-- Brand Logo Header -->
      <rect x="60" y="60" width="170" height="42" rx="8" fill="#047857" />
      <text x="80" y="88" font-family="system-ui, sans-serif" font-weight="bold" font-size="18" fill="#ffffff">ECOHYDRATE</text>
      
      <text x="60" y="190" font-family="system-ui, sans-serif" font-weight="900" font-size="48" fill="#ffffff">KEEP COLD FOR 24H</text>
      <text x="60" y="240" font-family="system-ui, sans-serif" font-weight="600" font-size="24" fill="#a7f3d0">100% BPA-Free Recycled Stainless Steel</text>

      <!-- Bottle render -->
      <g transform="translate(480, 260)">
        <rect x="60" y="30" width="90" height="340" rx="36" fill="#10b981" stroke="#34d399" stroke-width="4" />
        <rect x="85" y="0" width="40" height="36" rx="6" fill="#065f46" />
        <text x="85" y="220" font-family="system-ui, sans-serif" font-weight="bold" font-size="16" fill="#ffffff" transform="rotate(-90 85 220)">ECOHYDRATE PRO</text>
      </g>

      <!-- Verified Badges -->
      <g transform="translate(60, 320)">
        <rect x="0" y="0" width="340" height="60" rx="10" fill="#065f46" stroke="#059669" stroke-width="1.5" />
        <text x="20" y="36" font-family="system-ui, sans-serif" font-weight="bold" font-size="16" fill="#a7f3d0">✓ 2-Year Manufacturer Warranty</text>
      </g>

      <g transform="translate(60, 400)">
        <rect x="0" y="0" width="340" height="60" rx="10" fill="#065f46" stroke="#059669" stroke-width="1.5" />
        <text x="20" y="36" font-family="system-ui, sans-serif" font-weight="bold" font-size="16" fill="#a7f3d0">✓ Certified B-Corp Sustainable</text>
      </g>

      <rect x="60" y="520" width="220" height="54" rx="10" fill="#10b981" />
      <text x="95" y="554" font-family="system-ui, sans-serif" font-weight="bold" font-size="18" fill="#022c22">SHOP NOW $34.99</text>

      <!-- Required Legal Disclaimer -->
      <text x="60" y="740" font-family="system-ui, sans-serif" font-size="13" fill="#6ee7b7">Tested according to ASTM international thermal standards. Actual retention may vary based on ambient conditions.</text>
      `
    )
  },
  {
    id: 'purevive-ppt-demo',
    name: 'PureVive Skincare (PPT Slide 2 & 6 Demo)',
    category: 'PPT Specification Demo',
    title: 'PureVive Revitalift Anti-Aging Campaign',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: 'Revitalift Cream removes wrinkles in 7 days. Our breakthrough formula guarantees younger, healthier-looking skin. 100% natural and Dermatologist Approved!',
    imageDescription: 'Skincare advertisement containing unapproved medical endorsement badge, unsupported wrinkle removal claims, and questionable disclaimer contrast as depicted in BrandGuard AI PPT Slide 2',
    expectedFindings: [
      'Unsupported claim: "Clinically proven results in 7 days" requires clinical trial documentation in knowledge base',
      'Unsupported absolute claim: "guarantees younger, healthier-looking skin" violates cosmetic claim standards',
      'Unapproved asset / badge: "Dermatologist Approved" medical seal is not in Brand Assets registry',
      'Fact breach: Caption promises "removes wrinkles in 7 days" which violates Corporate Fact CF-05'
    ],
    svgDataUrl: createSvgDataUrl(
      800,
      800,
      `
      <defs>
        <linearGradient id="pvBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#f1f5f9" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#pvBg)" />

      <!-- PUREVIVE Header -->
      <text x="60" y="80" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#1e293b" letter-spacing="1">PUREVIVE</text>
      <text x="60" y="105" font-family="system-ui, sans-serif" font-weight="600" font-size="14" fill="#64748b" letter-spacing="3">SKINCARE</text>

      <!-- Headline -->
      <text x="60" y="180" font-family="system-ui, sans-serif" font-weight="800" font-size="38" fill="#0f172a">Clinically proven</text>
      <text x="60" y="225" font-family="system-ui, sans-serif" font-weight="800" font-size="38" fill="#0f172a">results in 7 days</text>

      <!-- Subtext -->
      <text x="60" y="280" font-family="system-ui, sans-serif" font-size="18" fill="#475569">Our breakthrough formula</text>
      <text x="60" y="308" font-family="system-ui, sans-serif" font-size="18" fill="#475569">guarantees younger,</text>
      <text x="60" y="336" font-family="system-ui, sans-serif" font-size="18" fill="#475569">healthier-looking skin.</text>

      <!-- Product Cream Jar Render -->
      <g transform="translate(460, 220)">
        <rect x="0" y="80" width="260" height="180" rx="30" fill="#0f172a" />
        <rect x="30" y="40" width="200" height="50" rx="15" fill="#64748b" />
        <text x="130" y="150" font-family="system-ui, sans-serif" font-weight="bold" font-size="22" fill="#ffffff" text-anchor="middle" letter-spacing="2">PUREVIVE</text>
        <text x="130" y="180" font-family="system-ui, sans-serif" font-weight="500" font-size="14" fill="#94a3b8" text-anchor="middle" letter-spacing="1">REVITALIFT CREAM</text>
      </g>

      <!-- Badges Row -->
      <!-- 100% Natural -->
      <g transform="translate(60, 520)">
        <circle cx="40" cy="40" r="35" fill="none" stroke="#64748b" stroke-width="2" />
        <path d="M40 20 C55 30 55 55 40 60 C25 55 25 30 40 20 Z" fill="#10b981" opacity="0.6" />
        <text x="40" y="100" font-family="system-ui, sans-serif" font-weight="600" font-size="15" fill="#334155" text-anchor="middle">100% Natural</text>
      </g>

      <!-- Dermatologist Approved (Unapproved Seal) -->
      <g transform="translate(240, 520)">
        <circle cx="50" cy="40" r="40" fill="none" stroke="#0284c7" stroke-width="3" stroke-dasharray="4 2" />
        <path d="M42 25 H58 V35 H68 V45 H58 V55 H42 V45 H32 V35 H42 Z" fill="#0284c7" />
        <text x="50" y="100" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#0f172a" text-anchor="middle">DERMATOLOGIST</text>
        <text x="50" y="118" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#0f172a" text-anchor="middle">APPROVED</text>
      </g>

      <!-- Cruelty Free -->
      <g transform="translate(440, 520)">
        <circle cx="40" cy="40" r="35" fill="none" stroke="#64748b" stroke-width="2" />
        <path d="M30 30 Q35 15 40 30 Q45 15 50 30 Q55 45 40 55 Q25 45 30 30 Z" fill="#94a3b8" />
        <text x="40" y="100" font-family="system-ui, sans-serif" font-weight="600" font-size="15" fill="#334155" text-anchor="middle">Cruelty Free</text>
      </g>

      <!-- Mandatory Legal Disclaimer Footer -->
      <rect x="60" y="710" width="680" height="40" rx="8" fill="#e2e8f0" opacity="0.6" />
      <text x="80" y="735" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">Results may vary. Not intended to diagnose, treat, cure, or prevent any disease.</text>
      `
    )
  }
];
