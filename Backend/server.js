import express from 'express';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import adminRoutes from './routes/admin.route.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(process.cwd(), 'Uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const __dirname2 = path.resolve();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({
  origin: 'https://digital-dockets-sih-ggqd.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', 'https://digital-dockets-sih-ggqd.vercel.app');
  console.log('Request:', {
    url: req.url,
    headers: req.headers,
    cookies: req.cookies,
  });
  next();
});

app.use(cookieParser());

app.use('/Uploads', express.static(path.join(__dirname, 'Uploads'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  },
}));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname2, '../Frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname2, '../Frontend/dist/index.html'));
  });
}

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  app.close(() => {
    console.log('Process terminated.');
  });
});