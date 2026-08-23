const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Configure CORS for production (Render backend + Netlify frontend)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : '*';

app.use(
  cors({
    origin: allowedOrigins === '*' ? '*' : allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Full-Stack Blog Application API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Root API Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Full-Stack Blog Platform API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      blogs: '/api/blogs',
    },
  });
});

// 404 Handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found - ${req.originalUrl}`,
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Start server after Database connection is established
const startServer = async () => {
  await connectDB();
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server listening in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  }
};

startServer();

module.exports = app;
