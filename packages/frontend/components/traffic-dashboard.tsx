"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveTrafficTable } from "@/components/live-traffic-table";
import { HistoryTrafficTable } from "@/components/history-traffic-table";
import { DashboardHeader } from "@/components/dashboard-header";
import { StoreSelector } from "@/components/store-selector";
import { TrafficEvent, HistoricalTrafficData, StoreData } from "@/types";
import { useTheme } from "next-themes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function TrafficDashboard() {
  const [liveTraffic, setLiveTraffic] = useState<TrafficEvent[]>([]);
  const [historyTraffic, setHistoryTraffic] = useState<HistoricalTrafficData[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { theme } = useTheme();

  const fetchLiveTraffic = async () => {
    try {
      const storeParam = selectedStore ? `?store_id=${selectedStore}` : '';
      const response = await fetch(`${API_URL}/api/traffic/live${storeParam}`);
      const data = await response.json();
      setLiveTraffic(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch live traffic data:", error);
    }
  };

  const fetchHistoryTraffic = async () => {
    try {
      const storeParam = selectedStore ? `?store_id=${selectedStore}` : '';
      const response = await fetch(`${API_URL}/api/traffic/history${storeParam}`);
      const data = await response.json();
      setHistoryTraffic(data);
    } catch (error) {
      console.error("Failed to fetch history traffic data:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stores`);
      const data = await response.json();
      setStores(data);
      if (data.length > 0 && !selectedStore) {
        setSelectedStore(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await Promise.all([fetchLiveTraffic(), fetchHistoryTraffic()]);
    setIsLoading(false);
  };

  const handleStoreChange = (storeId: number) => {
    setSelectedStore(storeId);
  };

  useEffect(() => {
    console.log("Theme:", liveTraffic);
    const fetchAllData = async () => {
      setIsLoading(true);
      await fetchStores();
      await Promise.all([fetchLiveTraffic(), fetchHistoryTraffic()]);
      setIsLoading(false);
    };

    fetchAllData();

    // Set up polling for live data
    const interval = setInterval(() => {
      fetchLiveTraffic();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedStore !== null) {
      handleRefresh();
    }
  }, [selectedStore]);

  useEffect(() => {
    console.log("Theme:", liveTraffic);
  },[liveTraffic]);

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader 
        onRefresh={handleRefresh} 
        lastUpdated={lastUpdated}
        isLoading={isLoading}
      />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Store Traffic Analytics</h2>
          <StoreSelector 
            stores={stores} 
            selectedStore={selectedStore} 
            onStoreChange={handleStoreChange} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current In-Store</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {liveTraffic.reduce((sum, event) => sum + event.customers_in - event.customers_out, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Entries Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {liveTraffic.reduce((sum, event) => sum + event.customers_in, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Exits Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {liveTraffic.reduce((sum, event) => sum + event.customers_out, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="live" className="space-y-4">
          <TabsList>
            <TabsTrigger value="live">Live Traffic</TabsTrigger>
            <TabsTrigger value="history">Historical Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live" className="space-y-4">
            <LiveTrafficTable data={liveTraffic} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <HistoryTrafficTable data={historyTraffic} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}