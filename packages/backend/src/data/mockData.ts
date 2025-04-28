import { TrafficEvent, StoreData } from '../types';
import { format, subHours } from 'date-fns';

// Mock store data
export const stores: StoreData[] = [
  { id: 10, name: 'Downtown Store' },
  { id: 20, name: 'Mall Location' },
  { id: 30, name: 'Airport Terminal' },
  { id: 40, name: 'Suburban Center' }
];

// Generate traffic data for past 24 hours
export function generateMockTrafficData(): TrafficEvent[] {
  const events: TrafficEvent[] = [];
  const now = new Date();

  stores.forEach(store => {
    for (let hour = 0; hour < 24; hour++) {
      const baseTime = subHours(now, 24 - hour);
      const isPeakHour = (hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 18);
      const eventCount = isPeakHour ? 10 : 3;

      for (let i = 0; i < eventCount; i++) {
        let customersIn = 0;
        let customersOut = 0;

        if (hour === 8 || hour === 9) {
          // Opening hours
          customersIn = rand(3, 6);
          customersOut = rand(0, customersIn - 1);
        } else if (hour === 20 || hour === 21) {
          // Closing hours
          customersIn = rand(0, 2);
          customersOut = rand(0, customersIn);
        } else if (isPeakHour) {
          customersIn = rand(2, 5);
          customersOut = rand(0, customersIn - 1);
        } else {
          customersIn = rand(1, 3);
          customersOut = rand(0, customersIn);
        }

        if (customersIn === 0) continue; // Ignore events with no entries

        const eventTime = new Date(baseTime);
        eventTime.setMinutes(rand(0, 59));
        eventTime.setSeconds(rand(0, 59));

        events.push({
          store_id: store.id,
          customers_in: customersIn,
          customers_out: customersOut,
          time_stamp: eventTime.getTime()
        });
      }
    }
  });

  return events.sort((a, b) => Number(b.time_stamp) - Number(a.time_stamp));
}

// Helper: generate random integer between min and max (inclusive)
function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Aggregate hourly data by store
export function aggregateHistoricalData(events: TrafficEvent[]): Map<string, any> {
  const hourlyData = new Map<string, any>();

  events.forEach(event => {
    const timestamp = new Date(
      typeof event.time_stamp === 'string'
        ? event.time_stamp.includes('.')
          ? parseTimestampFormat(event.time_stamp)
          : Number(event.time_stamp)
        : Number(event.time_stamp)
    );

    const hourKey = `${event.store_id}-${format(timestamp, 'HH:00')}`;

    if (!hourlyData.has(hourKey)) {
      hourlyData.set(hourKey, {
        hour: format(timestamp, 'HH:00'),
        store_id: event.store_id,
        total_in: 0,
        total_out: 0,
        net: 0
      });
    }

    const hourData = hourlyData.get(hourKey);
    hourData.total_in += event.customers_in;
    hourData.total_out += event.customers_out;
    hourData.net = hourData.total_in - hourData.total_out;
  });

  return hourlyData;
}

// Handle "10.30.45" format
function parseTimestampFormat(timestamp: string): number {
  const [h, m, s] = timestamp.split('.').map(Number);
  const date = new Date();
  date.setHours(h, m, s, 0);
  return date.getTime();
}
