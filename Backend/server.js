import express from 'express'
import { connectDB } from './lib/db.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from "cookie-parser";
import cors from "cors"
import adminRoutes from './routes/admin.route.js'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv'
dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const __dirname2= path.resolve();

// Increase payload limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({
  origin: "https://digital-dockets-sih-ggqd.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept']
}))

app.use(cookieParser())

// Secure static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));


// Routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

if(process.env.NODE_ENV === 'production') {
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

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  app.close(() => {
    console.log('Process terminated.');
  });
});