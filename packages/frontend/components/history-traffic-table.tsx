"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { HistoricalTrafficData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface HistoryTrafficTableProps {
  data: HistoricalTrafficData[];
  isLoading?: boolean;
}

export function HistoryTrafficTable({ data, isLoading = false }: HistoryTrafficTableProps) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? "#ffffff" : "#000000";
  
  const chartData = [...data].sort((a, b) => {
    const hourA = parseInt(a.hour.split(':')[0]);
    const hourB = parseInt(b.hour.split(':')[0]);
    return hourA - hourB;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Traffic Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                Loading chart data...
              </div>
            ) : data.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                No historical data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fill: textColor }}
                    tickFormatter={(hour) => hour}
                  />
                  <YAxis tick={{ fill: textColor }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                      color: textColor
                    }}
                  />
                  <Legend />
                  <Bar 
                    name="Entries" 
                    dataKey="total_in" 
                    fill="hsl(var(--positive))" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    name="Exits" 
                    dataKey="total_out" 
                    fill="hsl(var(--negative))" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    name="Net Change" 
                    dataKey="net" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hour</TableHead>
              <TableHead>Store ID</TableHead>
              <TableHead>Total In</TableHead>
              <TableHead>Total Out</TableHead>
              <TableHead className="text-right">Net Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No historical data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((hour, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{hour.hour}</TableCell>
                  <TableCell>{hour.store_id}</TableCell>
                  <TableCell className="text-positive">{hour.total_in}</TableCell>
                  <TableCell className="text-negative">{hour.total_out}</TableCell>
                  <TableCell className="text-right">
                    <span className={`
                      ${hour.net > 0 ? 'text-positive' : hour.net < 0 ? 'text-negative' : ''}
                    `}>
                      {hour.net > 0 && "+"}
                      {hour.net}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}