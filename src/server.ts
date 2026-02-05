/**
 * Arcadia Health - Web Server
 * Express server for the Arcadia Health web application
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { createArcadiaHealthSystem, ArcadiaHealthSystem } from './index';

const app = express();
const PORT = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize system
let system: ArcadiaHealthSystem | null = null;

async function initializeSystem() {
  try {
    system = await createArcadiaHealthSystem();
    console.log('Arcadia Health system initialized');
  } catch (error) {
    console.error('Failed to initialize system:', error);
  }
}

// API Routes

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response): void => {
  if (!system) {
    res.status(503).json({ 
      status: 'unavailable', 
      message: 'System not initialized' 
    });
    return;
  }
  
  const healthStatus = system.getHealthStatus();
  res.json({
    status: 'healthy',
    system: healthStatus,
    timestamp: new Date().toISOString()
  });
});

// System status endpoint
app.get('/api/status', (_req: Request, res: Response): void => {
  if (!system) {
    res.status(503).json({ 
      status: 'unavailable', 
      message: 'System not initialized' 
    });
    return;
  }
  
  const status = system.getHealthStatus();
  res.json(status);
});

// Encryption service endpoints
app.post('/api/encrypt', (req: Request, res: Response): void => {
  if (!system) {
    res.status(503).json({ error: 'System not initialized' });
    return;
  }
  
  try {
    const { data } = req.body;
    if (!data || typeof data !== 'string') {
      res.status(400).json({ error: 'Invalid data provided' });
      return;
    }
    
    const encryptionService = system.getEncryptionService();
    const encrypted = encryptionService.encrypt(data);
    res.json({ encrypted });
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ error: 'Encryption failed' });
  }
});

app.post('/api/decrypt', (req: Request, res: Response): void => {
  if (!system) {
    res.status(503).json({ error: 'System not initialized' });
    return;
  }
  
  try {
    const { encrypted } = req.body;
    if (!encrypted || typeof encrypted !== 'object') {
      res.status(400).json({ error: 'Invalid encrypted data provided' });
      return;
    }
    
    const encryptionService = system.getEncryptionService();
    const decrypted = encryptionService.decrypt(encrypted);
    res.json({ decrypted });
  } catch (error) {
    console.error('Decryption error:', error);
    res.status(500).json({ error: 'Decryption failed' });
  }
});

// Serve frontend - catch-all route must be last
// Use a function to handle all non-API routes
app.use((req: Request, res: Response, next: express.NextFunction): void => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    next();
    return;
  }
  // Serve index.html for all other routes (SPA fallback)
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
async function startServer() {
  await initializeSystem();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Arcadia Health Web Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📈 System status: http://localhost:${PORT}/api/status\n`);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  if (system) {
    await system.shutdown();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  if (system) {
    await system.shutdown();
  }
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
