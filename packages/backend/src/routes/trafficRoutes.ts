import express from 'express';
import { 
  getLiveTraffic, 
  getHistoricalTraffic, 
  addTrafficEvent,
  getStores
} from '../services/trafficService';

const router = express.Router();

// Get live traffic data
router.get('/traffic/live', (req, res) => {
  const storeId = req.query.store_id ? parseInt(req.query.store_id as string) : undefined;
  const data = getLiveTraffic(storeId);
  res.json(data);
});

// Get historical traffic data
router.get('/traffic/history', (req, res) => {
  const storeId = req.query.store_id ? parseInt(req.query.store_id as string) : undefined;
  const data = getHistoricalTraffic(storeId);
  res.json(data);
});

// Get all stores
router.get('/stores', (req, res) => {
  const stores = getStores();
  res.json(stores);
});

// Add a new traffic event (for testing)
router.post('/traffic', (req, res) => {
  const event = req.body;
  const newEvent = addTrafficEvent(event);
  res.status(201).json(newEvent);
});

export default router;