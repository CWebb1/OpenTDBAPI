import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';
import cors from 'cors';
import { authMiddleware } from './src/middleware/auth.js';
import { errorHandler } from './src/middleware/errorHandling.js';

// Import routes
import authRoute from './src/routes/authRoute.js';
import quizRoute from './src/routes/quizRoute.js';
import userRoute from './src/routes/userRoute.js';
import scoreRoute from './src/routes/scoreRoute.js';

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/quizzes', authMiddleware, quizRoute);
app.use('/api/users', authMiddleware, userRoute);
app.use('/api/scores', authMiddleware, scoreRoute);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. http://localhost:${PORT}/api-docs for documentation`);
});