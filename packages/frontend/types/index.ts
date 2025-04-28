export interface TrafficEvent {
  store_id: number;
  customers_in: number;
  customers_out: number;
  time_stamp: string | number;
}

export interface HistoricalTrafficData {
  hour: string;
  store_id: number;
  total_in: number;
  total_out: number;
  net: number;
}

export interface StoreData {
  id: number;
  name: string;
}