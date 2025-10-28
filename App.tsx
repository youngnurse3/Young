
import React, { useState, useEffect } from 'react';
import { StockItem, Transaction, TransactionType } from './types';
import Header from './components/Header';
import AddItemForm from './components/AddItemForm';
import StockList from './components/StockList';
import WeeklySummary from './components/WeeklySummary';

const App: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    try {
      const savedItems = localStorage.getItem('stockItems');
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error("Error reading stock items from localStorage", error);
      return [];
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions');
      if (savedTransactions) {
        const parsed = JSON.parse(savedTransactions);
        // Dates are stored as strings, so we need to convert them back
        return parsed.map((t: Transaction) => ({ ...t, timestamp: new Date(t.timestamp) }));
      }
      return [];
    } catch (error) {
      console.error("Error reading transactions from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('stockItems', JSON.stringify(stockItems));
    } catch (error) {
      console.error("Error saving stock items to localStorage", error);
    }
  }, [stockItems]);

  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving transactions to localStorage", error);
    }
  }, [transactions]);

  const handleAddItem = (name: string, quantity: number) => {
    const newItem: StockItem = {
      id: crypto.randomUUID(),
      name,
      quantity,
    };
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      itemId: newItem.id,
      itemName: newItem.name,
      type: TransactionType.ADD,
      quantity,
      timestamp: new Date(),
    };
    setStockItems(prevItems => [...prevItems, newItem]);
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  };

  const handleUpdateQuantity = (itemId: string, type: TransactionType.REFILL | TransactionType.WITHDRAW, amount: number) => {
    let updatedItemName = '';
    setStockItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          updatedItemName = item.name;
          const newQuantity = type === TransactionType.REFILL ? item.quantity + amount : item.quantity - amount;
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      itemId,
      itemName: updatedItemName,
      type,
      quantity: amount,
      timestamp: new Date(),
    };
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
  };
  
  const handleRemoveItem = (itemId: string) => {
    setStockItems(prevItems => prevItems.filter(item => item.id !== itemId));
    // We keep transactions for historical data
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AddItemForm onAddItem={handleAddItem} />
            <StockList items={stockItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem}/>
          </div>
          <div className="lg:col-span-1">
            <WeeklySummary transactions={transactions} stockItems={stockItems} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
