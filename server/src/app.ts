import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import morgan from 'morgan';
import adminRoutes from './routes/AdminRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';
import machineRoutes from './routes/MachineRoutes.js';
import sectorRoutes from './routes/SectorRoutes.js';
import solutionRoutes from './routes/SolutionRoutes.js';
import authRoutes from './routes/AuthRoutes.js';

const app: Express = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(morgan(process.env['NODE_ENV'] === 'development' ? 'dev' : 'combined'));

app.use(cors());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/category', categoryRoutes);
app.use('/machine', machineRoutes);
app.use('/sector', sectorRoutes);
app.use('/solution', solutionRoutes);

export default app;
