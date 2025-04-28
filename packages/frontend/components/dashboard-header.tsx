"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { RefreshCcw, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  onRefresh: () => void;
  lastUpdated?: Date;
  isLoading?: boolean;
}

export function DashboardHeader({ 
  onRefresh, 
  lastUpdated, 
  isLoading = false 
}: DashboardHeaderProps) {
  const [latestTime, setLatestTime] = useState<Date>();

  useEffect(() => {
    setLatestTime(lastUpdated);
  }, [lastUpdated]);

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b">
      <div className="flex items-center space-x-2">
        <UsersRound className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">Customer Traffic Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
           Last updated: {latestTime?.toLocaleTimeString()}
          </p>
        )}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <ThemeToggle />
      </div>
    </header>
  );
}