import { storage } from '../src/server/storage';
import { analyzeCreativeCompliance } from '../src/server/complianceEngine';

async function runTest() {
  console.log('========================================================================');
  console.log('TEST: ADVERTISEMENT WITH VISIBLE SPELLING MISTAKE AND INCORRECT PRICE');
  console.log('========================================================================\n');

  // 1. Create a new creative advertisement image with visible spelling mistakes and incorrect price
  const testCreativeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="#0f172a" />
    
    <!-- Brand Header -->
    <text x="60" y="80" font-family="sans-serif" font-weight="900" font-size="28" fill="#38bdf8">APEXSOUND AUDIO</text>
    <text x="60" y="110" font-family="sans-serif" font-weight="600" font-size="14" fill="#94a3b8">FLASH SALE CAMPAIGN</text>

    <!-- Visible Spelling Mistake in Main Headline -->
    <text x="60" y="210" font-family="sans-serif" font-weight="800" font-size="36" fill="#ffffff">SPECLAL OFFER: 100% GURANTEED</text>
    <text x="60" y="260" font-family="sans-serif" font-weight="800" font-size="32" fill="#38bdf8">HIGH PERFOMANCE AUDIO</text>

    <!-- Visible Incorrect Price Badge on Creative -->
    <g transform="translate(60, 340)">
      <rect x="0" y="0" width="280" height="110" rx="16" fill="#ef4444" />
      <text x="20" y="45" font-family="sans-serif" font-weight="700" font-size="16" fill="#ffffff">FLASH DEAL TODAY</text>
      <text x="20" y="95" font-family="sans-serif" font-weight="900" font-size="52" fill="#ffffff">$49</text>
      <text x="145" y="88" font-family="sans-serif" font-weight="600" font-size="20" fill="#fecaca">WAS $149</text>
    </g>

    <!-- Soundbar Graphic Device -->
    <g transform="translate(60, 500)">
      <rect x="0" y="0" width="680" height="70" rx="14" fill="#1e293b" stroke="#334155" stroke-width="3" />
      <text x="340" y="42" font-family="sans-serif" font-weight="bold" font-size="18" fill="#64748b" text-anchor="middle">APEXSOUND PULSE CINEMA BAR</text>
    </g>

    <!-- Legal disclaimer footer -->
    <text x="60" y="720" font-family="sans-serif" font-size="12" fill="#64748b">*Terms apply. Offer ends soon.</text>
  </svg>`;

  const creativeDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(testCreativeSvg)}`;
  const reviewId = `rev-test-ad-${Date.now()}`;

  // Accompanying caption advertising $99 (directly contradicting the $49 on the creative graphic)
  const conflictingCaption = 'ApexSound Flash Sale! Get the Pulse Cinema Bar for only $99 (regularly $149). Unbeatable premium sound quality!';

  console.log('[STEP 1] Submitting newly uploaded advertisement to BrandGuard AI Compliance Engine...');
  console.log(`  Ad Title: ApexSound Pulse Flash Sale Promo`);
  console.log(`  Image features visible spelling mistake: "SPECLAL OFFER: 100% GURANTEED"`);
  console.log(`  Image features price: "$49" (Caption advertises: "$99")`);

  const auditResult = await analyzeCreativeCompliance({
    reviewId,
    title: 'ApexSound Pulse Flash Sale Promo',
    contentType: 'Social Media Post (Instagram / LinkedIn)',
    caption: conflictingCaption,
    imageUrl: creativeDataUrl,
  });

  console.log('\n[STEP 2] Audit Result Summary:');
  console.log(`  Review ID: ${auditResult.id}`);
  console.log(`  Compliance Status: ${auditResult.status}`);
  console.log(`  Compliance Score: ${auditResult.compliance_score}%`);
  console.log(`  Findings Count: ${auditResult.findings?.length || 0}`);

  const findings = auditResult.findings || [];
  if (findings.length === 0) {
    throw new Error('FAILURE: No findings returned from audit!');
  }

  // Verify spelling mistake detection
  const spellingFinding = findings.find(
    (f) =>
      f.category === 'Spelling & Text Accuracy' ||
      f.finding_title.toLowerCase().includes('typo') ||
      f.finding_title.toLowerCase().includes('spell') ||
      (f.detected_text && (f.detected_text.toLowerCase().includes('speclal') || f.detected_text.toLowerCase().includes('guranteed')))
  );

  console.log('\n[STEP 3] Verifying Spelling Mistake Detection:');
  if (!spellingFinding) {
    throw new Error('FAILURE: Spelling mistake was NOT detected on the uploaded creative!');
  }
  console.log(`  ✓ Detected: "${spellingFinding.finding_title}"`);
  console.log(`    Severity: ${spellingFinding.severity}`);
  console.log(`    Detected Text: "${spellingFinding.detected_text}"`);
  console.log(`    Solution: "${spellingFinding.solution}"`);
  console.log(`    Bounding Box:`, spellingFinding.bounding_box);

  if (!spellingFinding.bounding_box || spellingFinding.bounding_box.is_uncertain) {
    throw new Error('FAILURE: Spelling mistake does not have valid bounding box coordinates!');
  }
  const sBox = spellingFinding.bounding_box;
  if (sBox.width! <= 0 || sBox.height! <= 0 || sBox.x! < 0 || sBox.x! > 1 || sBox.y! < 0 || sBox.y! > 1) {
    throw new Error('FAILURE: Spelling mistake coordinates are out of normalized bounds [0..1]!');
  }
  console.log(`  ✓ Spelling coordinates normalized correctly: x=${sBox.x}, y=${sBox.y}, w=${sBox.width}, h=${sBox.height}`);

  // Verify pricing contradiction detection
  const pricingFinding = findings.find(
    (f) =>
      f.category === 'Pricing & Discounts' ||
      f.finding_title.toLowerCase().includes('price') ||
      f.finding_title.toLowerCase().includes('pricing') ||
      (f.detected_text && (f.detected_text.includes('$49') || f.detected_text.includes('$99')))
  );

  console.log('\n[STEP 4] Verifying Incorrect Price Contradiction Detection:');
  if (!pricingFinding) {
    throw new Error('FAILURE: Pricing contradiction was NOT detected on the uploaded creative!');
  }
  console.log(`  ✓ Detected: "${pricingFinding.finding_title}"`);
  console.log(`    Severity: ${pricingFinding.severity}`);
  console.log(`    Detected Text: "${pricingFinding.detected_text}"`);
  console.log(`    Solution: "${pricingFinding.solution}"`);
  console.log(`    Bounding Box:`, pricingFinding.bounding_box);

  if (!pricingFinding.bounding_box || pricingFinding.bounding_box.is_uncertain) {
    throw new Error('FAILURE: Pricing contradiction does not have valid bounding box coordinates!');
  }
  const pBox = pricingFinding.bounding_box;
  if (pBox.width! <= 0 || pBox.height! <= 0 || pBox.x! < 0 || pBox.x! > 1 || pBox.y! < 0 || pBox.y! > 1) {
    throw new Error('FAILURE: Pricing contradiction coordinates are out of normalized bounds [0..1]!');
  }
  console.log(`  ✓ Pricing coordinates normalized correctly: x=${pBox.x}, y=${pBox.y}, w=${pBox.width}, h=${pBox.height}`);

  // Verify Numbered Markers & Selection Alignment
  console.log('\n[STEP 5] Verifying Numbered Markers & Bi-directional Zoom Alignment:');
  findings.forEach((f, i) => {
    const issueNum = f.issue_number || i + 1;
    console.log(`  Marker #${issueNum}: [${f.severity}] ${f.finding_title}`);
    if (f.bounding_box && !f.bounding_box.is_uncertain) {
      const centerX = ((f.bounding_box.x! + f.bounding_box.width! / 2) * 100).toFixed(1);
      const centerY = ((f.bounding_box.y! + f.bounding_box.height! / 2) * 100).toFixed(1);
      console.log(`    -> Box Center: (${centerX}%, ${centerY}%) | Zoom anchor ready`);
    } else {
      console.log(`    -> Location: ${f.location_description}`);
    }
  });

  // Verify Refresh & Persistence
  console.log('\n[STEP 6] Simulating Page Refresh (Fetch from Database by ID):');
  const persisted = await storage.getReviewById(reviewId);
  if (!persisted) {
    throw new Error('FAILURE: Review was not found in storage after creation!');
  }
  const persistedFindings = persisted.findings || [];
  const persistedBoxes = persistedFindings.filter((f) => f.bounding_box && !f.bounding_box.is_uncertain);
  console.log(`  ✓ Review persisted in storage with ${persistedFindings.length} findings`);
  console.log(`  ✓ Preserved ${persistedBoxes.length} valid bounding box annotations across page refresh`);

  // Verify Data Integrity: Original reviews, guidelines, facts, assets remain intact
  console.log('\n[STEP 7] Verifying Database Records Integrity:');
  const allReviews = await storage.getReviews();
  const allGuidelines = await storage.getGuidelines();
  const allFacts = await storage.getFacts();
  const allAssets = await storage.getAssets();

  console.log(`  Total reviews: ${allReviews.length} (original reviews preserved)`);
  console.log(`  Brand guidelines: ${allGuidelines.length} (11 active brand guidelines preserved)`);
  console.log(`  Approved corporate facts: ${allFacts.length} (5 facts preserved)`);
  console.log(`  Brand reference assets: ${allAssets.length} (9 assets preserved)`);

  if (allReviews.length < 22 || allGuidelines.length < 11 || allFacts.length < 5 || allAssets.length < 9) {
    throw new Error('FAILURE: Original genuine records were altered or lost!');
  }

  console.log('\n========================================================================');
  console.log('✓ ALL CHECKS PASSED: BOTH SPELLING & PRICING DETECTED & HIGHLIGHTED');
  console.log('========================================================================');
}

runTest().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
