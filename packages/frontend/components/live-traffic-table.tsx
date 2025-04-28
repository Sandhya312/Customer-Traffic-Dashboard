"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TrafficEvent } from "@/types";
import { formatTime } from "@/lib/utils";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

interface LiveTrafficTableProps {
  data: TrafficEvent[];
  isLoading?: boolean;
}

export function LiveTrafficTable({ data, isLoading = false }: LiveTrafficTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = data.filter((event) => 
    event.store_id.toString().includes(searchTerm)
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by store ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store ID</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Customers In</TableHead>
              <TableHead>Customers Out</TableHead>
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
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No traffic data available
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((event, index) => {
                const netChange = event.customers_in - event.customers_out;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{event.store_id}</TableCell>
                    <TableCell>{formatTime(event.time_stamp)}</TableCell>
                    <TableCell>
                      {event.customers_in > 0 && (
                        <span className="flex items-center text-positive">
                          <ArrowUp className="mr-1 h-4 w-4" />
                          {event.customers_in}
                        </span>
                      )}
                      {event.customers_in === 0 && "0"}
                    </TableCell>
                    <TableCell>
                      {event.customers_out > 0 && (
                        <span className="flex items-center text-negative">
                          <ArrowDown className="mr-1 h-4 w-4" />
                          {event.customers_out}
                        </span>
                      )}
                      {event.customers_out === 0 && "0"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`
                        ${netChange > 0 ? 'text-positive' : netChange < 0 ? 'text-negative' : ''}
                      `}>
                        {netChange > 0 && "+"}
                        {netChange}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}