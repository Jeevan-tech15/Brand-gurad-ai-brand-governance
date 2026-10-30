import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { storage } from './src/server/storage';
import { analyzeCreativeCompliance } from './src/server/complianceEngine';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support large image payloads (up to 20MB for high-res creative banners)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// 1. Health & Infrastructure Status
app.get('/api/health', (req, res) => {
  const status = storage.getStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    storage: status,
    gemini_vision: process.env.GEMINI_API_KEY ? 'Active (Gemini 3.8 Flash)' : 'Available (Simulated/Heuristic)',
    ocr: 'Active (Tesseract.js)',
  });
});

// 2. Dashboard Statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch dashboard stats' });
  }
});

// 3. Reviews API
app.get('/api/reviews', async (req, res) => {
  try {
    const { search, status, contentType } = req.query;
    const reviews = await storage.getReviews({
      search: search as string,
      status: status as string,
      contentType: contentType as string,
    });
    res.json(reviews);
  } catch (err: any) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch reviews' });
  }
});

app.get('/api/reviews/:id', async (req, res) => {
  try {
    const review = await storage.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (err: any) {
    console.error('Error fetching review:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch review' });
  }
});

// Create and audit a new creative review
app.post('/api/reviews', async (req, res) => {
  try {
    const { title, contentType, caption, imageUrl, isDraft } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Title and image are required.' });
    }

    const reviewId = `rev-${Date.now()}`;

    if (isDraft) {
      const draftReview = await storage.saveReview({
        id: reviewId,
        title,
        content_type: contentType || 'Social Media Post (Instagram / LinkedIn)',
        caption: caption || '',
        image_url: imageUrl,
        status: 'DRAFT',
        analysis_status: 'PENDING',
        compliance_score: 0,
        score_baseline: 100,
        score_deductions: [],
        findings: [],
        activity: [
          {
            id: `act-${Date.now()}`,
            review_id: reviewId,
            user_email: 'jvnaik2007@gmail.com',
            action: 'Draft Saved',
            details: 'Draft creative saved without initiating compliance audit',
            created_at: new Date().toISOString(),
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return res.json(draftReview);
    }

    // Execute compliance audit (OCR + Gemini Vision + Brand Rules + Corporate Facts)
    const result = await analyzeCreativeCompliance({
      reviewId,
      title,
      contentType: contentType || 'Social Media Post (Instagram / LinkedIn)',
      caption,
      imageUrl,
    });

    res.json(result);
  } catch (err: any) {
    console.error('Error analyzing creative review:', err);
    res.status(500).json({ error: err.message || 'Failed to complete compliance audit' });
  }
});

// Retry audit for an existing review
app.post('/api/reviews/:id/retry', async (req, res) => {
  try {
    const review = await storage.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const result = await analyzeCreativeCompliance({
      reviewId: review.id,
      title: review.title,
      contentType: review.content_type,
      caption: review.caption,
      imageUrl: review.image_url,
    });

    res.json(result);
  } catch (err: any) {
    console.error('Error retrying compliance audit:', err);
    res.status(500).json({ error: err.message || 'Failed to retry compliance audit' });
  }
});

// Update human audit status
app.post('/api/reviews/:id/status', async (req, res) => {
  try {
    const { status, note, userEmail } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await storage.updateReviewStatus(req.params.id, status, note, userEmail);
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(updated);
  } catch (err: any) {
    console.error('Error updating review status:', err);
    res.status(500).json({ error: err.message || 'Failed to update review status' });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const success = await storage.deleteReview(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: err.message || 'Failed to delete review' });
  }
});

// 4. Brand Guidelines
app.get('/api/guidelines', async (req, res) => {
  try {
    const guidelines = await storage.getGuidelines();
    res.json(guidelines);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/guidelines', async (req, res) => {
  try {
    const data = req.body;
    if (!data.rule_title) {
      return res.status(400).json({ error: 'Rule title is required' });
    }
    const guideline = await storage.saveGuideline({
      id: data.id || `bg-${Date.now()}`,
      rule_title: data.rule_title,
      category: data.category || 'Claims & Internal Consistency',
      description: data.description || '',
      severity_on_breach: data.severity_on_breach || 'MEDIUM',
      is_active: data.is_active !== false,
      required_disclaimer_text: data.required_disclaimer_text,
      prohibited_words: data.prohibited_words,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    res.json(guideline);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/guidelines/:id', async (req, res) => {
  try {
    await storage.deleteGuideline(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Approved Corporate Facts
app.get('/api/facts', async (req, res) => {
  try {
    const facts = await storage.getFacts();
    res.json(facts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/facts', async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.official_statement) {
      return res.status(400).json({ error: 'Title and official statement are required' });
    }
    const fact = await storage.saveFact({
      id: data.id || `cf-${Date.now()}`,
      entity_type: data.entity_type || 'CLAIM',
      title: data.title,
      official_statement: data.official_statement,
      category: data.category || 'General Corporate',
      verification_doc_ref: data.verification_doc_ref,
      valid_from: data.valid_from,
      valid_to: data.valid_to,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    res.json(fact);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/facts/:id', async (req, res) => {
  try {
    await storage.deleteFact(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Brand Assets
app.get('/api/assets', async (req, res) => {
  try {
    const assets = await storage.getAssets();
    res.json(assets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/assets', async (req, res) => {
  try {
    const data = req.body;
    if (!data.asset_name) {
      return res.status(400).json({ error: 'Asset name is required' });
    }
    const asset = await storage.saveAsset({
      id: data.id || `ba-${Date.now()}`,
      asset_name: data.asset_name,
      asset_type: data.asset_type || 'LOGO',
      image_url: data.image_url || '',
      usage_instructions: data.usage_instructions || '',
      is_approved: data.is_approved !== false,
      created_at: data.created_at || new Date().toISOString(),
    });
    res.json(asset);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/assets/:id', async (req, res) => {
  try {
    await storage.deleteAsset(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend in dev or prod
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const portNum = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
  app.listen(portNum, '0.0.0.0', () => {
    console.log(`BrandGuard AI server running on http://0.0.0.0:${portNum}`);
  });
}

startServer();
