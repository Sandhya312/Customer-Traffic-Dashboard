import express from 'express';
import cors from 'cors';
import trafficRoutes from './routes/trafficRoutes';
import { startSimulation } from './services/trafficService';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', trafficRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  
  // Start the traffic simulation
  startSimulation();
  console.log('Traffic simulation started');
});