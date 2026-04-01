const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root message
app.get('/', (req, res) => {
  res.json({
    message: 'Sportif TN backend is running',
    docs: '/api-docs',
  });
});

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sportif TN API',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/stars', require('./routes/stars'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/admin', require('./routes/admin'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sportif-tn')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;

// Export app for serverless platforms (e.g., Vercel)
module.exports = app;

// Only listen when running locally or in a traditional server environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
