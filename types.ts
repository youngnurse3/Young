
export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  lowStockThreshold?: number;
}

export enum TransactionType {
  ADD = 'ADD',
  REFILL = 'REFILL',
  WITHDRAW = 'WITHDRAW',
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string; // denormalized for easier summary
  type: TransactionType;
  quantity: number;
  timestamp: Date;
}