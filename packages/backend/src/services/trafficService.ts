import { TrafficEvent, HistoricalTrafficData } from '../types';
import { generateMockTrafficData, aggregateHistoricalData, stores } from '../data/mockData';

let trafficEvents: TrafficEvent[] = [];

// Initialize with mock data
const initializeData = () => {
  if (trafficEvents.length === 0) {
    trafficEvents = generateMockTrafficData();
  }
};

// Get the last 100 events (or filtered by store)
export const getLiveTraffic = (storeId?: number): TrafficEvent[] => {
  initializeData();
  
  let filteredEvents = trafficEvents;
  
  // Filter by store if provided
  if (storeId) {
    filteredEvents = filteredEvents.filter(event => event.store_id === storeId);
  }
  
  // Return the last 100 events
  return filteredEvents.slice(0, 100);
};

// Get historical data aggregated by hour
export const getHistoricalTraffic = (storeId?: number): HistoricalTrafficData[] => {
  initializeData();
  
  let filteredEvents = trafficEvents;
  
  // Filter by store if provided
  if (storeId) {
    filteredEvents = filteredEvents.filter(event => event.store_id === storeId);
  }
  
  // Aggregate by hour
  const hourlyData = aggregateHistoricalData(filteredEvents);
  
  // Convert Map to array and sort by hour
  return Array.from(hourlyData.values()).sort((a, b) => {
    const hourA = a.hour.split(':')[0];
    const hourB = b.hour.split(':')[0];
    return hourA - hourB;
  });
};

// Get all stores
export const getStores = () => {
  return stores;
};

// Add a new traffic event (for simulation purposes)
export const addTrafficEvent = (event: TrafficEvent) => {
  trafficEvents.unshift({
    ...event,
    time_stamp: event.time_stamp || new Date().getTime()
  });
  
  return event;
};

// Simulate new traffic events periodically
let simulationInterval: NodeJS.Timeout | null = null;

export const startSimulation = () => {
  if (simulationInterval) {
    return;
  }
  
  simulationInterval = setInterval(() => {
    // Randomly select a store
    const storeIndex = Math.floor(Math.random() * stores.length);
    const storeId = stores[storeIndex].id;
    
    // Generate random customer movement
    const customersIn = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0;
    const customersOut = customersIn === 0 ? Math.floor(Math.random() * 3) + 1 : 0;
    
    // Skip if no movement
    if (customersIn === 0 && customersOut === 0) {
      return;
    }
    
    // Add new event
    const newEvent: TrafficEvent = {
      store_id: storeId,
      customers_in: customersIn,
      customers_out: customersOut,
      time_stamp: new Date().getTime()
    };
    
    addTrafficEvent(newEvent);
    
    // Emit event through Socket.IO if needed
    // io.emit('new-traffic-event', newEvent);
    
  }, 5000); // Generate a new event every 5 seconds
};

export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
};