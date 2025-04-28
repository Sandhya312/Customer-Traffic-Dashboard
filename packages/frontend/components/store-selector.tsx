"use client";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { StoreData } from "@/types";

interface StoreSelectorProps {
  stores: StoreData[];
  selectedStore: number | null;
  onStoreChange: (storeId: number) => void;
}

export function StoreSelector({ 
  stores, 
  selectedStore, 
  onStoreChange 
}: StoreSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Store:</span>
      <Select
        value={selectedStore?.toString() || ""}
        onValueChange={(value) => onStoreChange(parseInt(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select store" />
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.id.toString()}>
              {store.name} (#{store.id})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}