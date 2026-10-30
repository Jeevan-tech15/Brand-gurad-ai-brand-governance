import { analyzeCreativeCompliance } from '../src/server/complianceEngine';
import { PRESET_SCENARIOS } from '../src/data/presets';

async function runTestSuite() {
  console.log('====================================================');
  console.log('BRANDGUARD AI - PRODUCTION COMPLIANCE ENGINE AUDIT');
  console.log('====================================================\n');

  // Test 1: Deliberate spelling error in image headline
  console.log('--- TEST 1: Deliberate Spelling & Typo in Headline ---');
  const spellingPreset = PRESET_SCENARIOS.find((p) => p.id === 'spelling-and-dates')!;
  const test1Result = await analyzeCreativeCompliance({
    reviewId: `test-spelling-${Date.now()}`,
    title: 'Typo Headline Test: GURANTEED PERFOMANCE',
    contentType: 'Promotional Banner (Web / Display)',
    caption: 'Discover fast computing with next-gen quantum workstations.',
    imageUrl: spellingPreset.svgDataUrl,
  });
  console.log('Status:', test1Result.status);
  console.log('Compliance Score:', test1Result.compliance_score);
  console.log(
    'Detected Findings:',
    test1Result.findings?.map((f) => `[${f.severity}] ${f.finding_title} (Source: ${f.evidence_source})`)
  );
  console.log(
    'Passes Test 1:',
    test1Result.findings?.some((f) => f.category === 'Spelling & Text Accuracy' || f.finding_title.toLowerCase().includes('spelling') || f.finding_title.toLowerCase().includes('typo'))
  );
  console.log('\n');

  // Test 2: Incorrect discount contradiction
  console.log('--- TEST 2: Discount Contradiction (50% Graphic vs 70% Caption) ---');
  const discountPreset = PRESET_SCENARIOS.find((p) => p.id === 'discount-conflict')!;
  const test2Result = await analyzeCreativeCompliance({
    reviewId: `test-discount-${Date.now()}`,
    title: 'Discount Conflict Test: 50% vs 70%',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: '🎉 UNBEATABLE SAVINGS! Get massive 70% OFF storewide this weekend only on all audio gear with code AUTUMN70.',
    imageUrl: discountPreset.svgDataUrl,
  });
  console.log('Status:', test2Result.status);
  console.log('Compliance Score:', test2Result.compliance_score);
  console.log(
    'Detected Findings:',
    test2Result.findings?.map((f) => `[${f.severity}] ${f.finding_title} (Source: ${f.evidence_source})`)
  );
  console.log(
    'Passes Test 2:',
    test2Result.findings?.some((f) => f.category === 'Pricing & Discounts' || f.finding_title.toLowerCase().includes('discount'))
  );
  console.log('\n');

  // Test 3: Product visual vs written claim mismatch (65W Chassis vs 100W Claim)
  console.log('--- TEST 3: Product Visual vs Written Claim (65W Chassis vs 100W Claim) ---');
  const specsPreset = PRESET_SCENARIOS.find((p) => p.id === 'specs-mismatch')!;
  const test3Result = await analyzeCreativeCompliance({
    reviewId: `test-specs-${Date.now()}`,
    title: 'Hardware Spec Mismatch: 65W vs 100W',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: 'Experience hyper-speed charging. The VoltPulse GaN Charger pumps out 100W multi-device power.',
    imageUrl: specsPreset.svgDataUrl,
  });
  console.log('Status:', test3Result.status);
  console.log('Compliance Score:', test3Result.compliance_score);
  console.log(
    'Detected Findings:',
    test3Result.findings?.map((f) => `[${f.severity}] ${f.finding_title} (Source: ${f.evidence_source})`)
  );
  console.log(
    'Passes Test 3:',
    test3Result.findings?.some((f) => f.finding_title.toLowerCase().includes('65w') || f.finding_title.toLowerCase().includes('spec') || f.evidence.includes('65W'))
  );
  console.log('\n');

  // Test 4: Conflicting offer dates
  console.log('--- TEST 4: Conflicting Offer Dates (Image Oct 15 vs Caption Nov 30) ---');
  const test4Result = await analyzeCreativeCompliance({
    reviewId: `test-dates-${Date.now()}`,
    title: 'Date Conflict Test: Oct 15 vs Nov 30',
    contentType: 'Promotional Banner (Web / Display)',
    caption: 'Our annual holiday blow-out sale continues through November 30! Don’t miss your chance.',
    imageUrl: spellingPreset.svgDataUrl, // contains "OFFER ENDS: OCTOBER 15, 2026"
  });
  console.log('Status:', test4Result.status);
  console.log('Compliance Score:', test4Result.compliance_score);
  console.log(
    'Detected Findings:',
    test4Result.findings?.map((f) => `[${f.severity}] ${f.finding_title} (Source: ${f.evidence_source})`)
  );
  console.log(
    'Passes Test 4:',
    test4Result.findings?.some((f) => f.finding_title.toLowerCase().includes('date') || f.finding_title.toLowerCase().includes('expiration'))
  );
  console.log('\n');

  // Test 5: Clean compliant creative (should NOT invent false violations)
  console.log('--- TEST 5: Clean Compliant Creative (EcoHydrate Pro Bottle) ---');
  const compliantPreset = PRESET_SCENARIOS.find((p) => p.id === 'compliant-creative')!;
  const test5Result = await analyzeCreativeCompliance({
    reviewId: `test-compliant-${Date.now()}`,
    title: 'EcoHydrate Pro Verified Compliant Post',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: 'Meet the EcoHydrate Pro: 100% BPA-free recycled stainless steel that keeps beverages cold for 24 hours. Includes our standard 2-year manufacturer warranty. Tested according to ASTM international thermal standards.',
    imageUrl: compliantPreset.svgDataUrl,
  });
  console.log('Status:', test5Result.status);
  console.log('Compliance Score:', test5Result.compliance_score);
  console.log(
    'Detected Findings:',
    test5Result.findings?.map((f) => `[${f.severity}] ${f.finding_title} (Source: ${f.evidence_source})`)
  );
  console.log('Passes Test 5 (Clean score >= 85 and not flagged):', test5Result.status !== 'FLAGGED' && test5Result.compliance_score >= 85);
  console.log('\n');

  // Test 6: Image with NO caption provided (Image-only analysis)
  console.log('--- TEST 6: Creative with NO Caption (Pure Image-Only Audit) ---');
  const test6Result = await analyzeCreativeCompliance({
    reviewId: `test-nocaption-${Date.now()}`,
    title: 'Chassis Specs Image-Only Audit (No Caption)',
    contentType: 'Product Advertisement (Feed / Story)',
    caption: '', // No caption
    imageUrl: specsPreset.svgDataUrl,
  });
  console.log('Status:', test6Result.status);
  console.log('Compliance Score:', test6Result.compliance_score);
  console.log('Vision Summary:', test6Result.vision_summary?.overall_summary);
  console.log(
    'Detected Findings Count:',
    test6Result.findings?.length
  );
  console.log('Passes Test 6 (Successfully audited without caption):', test6Result.analysis_status === 'COMPLETED');
  console.log('\n');

  // Test 7: PPT Presentation PureVive Skincare Ad Audit
  console.log('--- TEST 7: PPT Slide 2 PureVive Skincare Ad Audit & Visual Bounding Boxes ---');
  const purevivePreset = PRESET_SCENARIOS.find((p) => p.id === 'purevive-ppt-demo')!;
  const test7Result = await analyzeCreativeCompliance({
    reviewId: `test-purevive-${Date.now()}`,
    title: 'PureVive Revitalift Skincare (PPT Slide 2 Creative)',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: purevivePreset.caption,
    imageUrl: purevivePreset.svgDataUrl,
  });
  console.log('Status:', test7Result.status);
  console.log('Compliance Score:', test7Result.compliance_score);
  console.log(
    'Detected Findings:',
    test7Result.findings?.map((f) => `[#${f.issue_number} ${f.severity}] ${f.finding_title} (Location: ${f.location_description}, Status: ${f.status_type}, Box: ${JSON.stringify(f.bounding_box)})`)
  );
  const hasPureviveRules = test7Result.findings?.some(
    (f) =>
      f.finding_title.toLowerCase().includes('wrinkle') ||
      f.finding_title.toLowerCase().includes('dermatologist') ||
      f.finding_title.toLowerCase().includes('guarantee') ||
      f.finding_title.toLowerCase().includes('seal') ||
      f.finding_title.toLowerCase().includes('clinical') ||
      f.finding_title.toLowerCase().includes('endorsement') ||
      f.description.toLowerCase().includes('wrinkle') ||
      f.description.toLowerCase().includes('dermatologist')
  );
  const allHaveCoordinatesOrUncertain = test7Result.findings?.every(
    (f) =>
      f.bounding_box &&
      (f.bounding_box.is_uncertain ||
        (typeof f.bounding_box.x === 'number' && typeof f.bounding_box.width === 'number' && f.bounding_box.width > 0))
  );
  console.log('Passes Test 7 (PPT Rules Detected):', hasPureviveRules);
  console.log('Passes Test 7 (Valid Coordinates or Uncertain):', allHaveCoordinatesOrUncertain);
  console.log('\n====================================================');
  console.log('ALL TESTS COMPLETED');
  console.log('====================================================');
}

runTestSuite().catch(console.error);
