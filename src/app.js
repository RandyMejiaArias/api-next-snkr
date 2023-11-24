import config from './config.js';
import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import pkg from '../package.json' assert {type: 'json'};

import { createRol, createAdmin } from './libs/initialSetup.js';

// Importing Routes
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import scoringCharRoutes from './routes/scoringCharacteristic.routes.js';
import prefScoresRoutes from './routes/preferredScoring.routes.js';
import productRoutes from './routes/product.routes.js';
import sizeRoutes from './routes/size.routes.js';

// Initialization
const app = express();
createRol();
createAdmin();

// Settings
app.set('pkg', pkg);
app.set('port', config.PORT);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(json());
app.use(express.urlencoded({ extended: false }));

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to my API',
    name: app.get('pkg').name,
    version: app.get('pkg').version,
    description: app.get('pkg').description,
    author: app.get('pkg').author
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/preferredScoring', prefScoresRoutes);
app.use('/api/scoringCharacteristics', scoringCharRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sizes', sizeRoutes);

export {
  app
};
