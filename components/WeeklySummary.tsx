
import React, { useMemo } from 'react';
import { StockItem, Transaction, TransactionType } from '../types';
import { ChartBarIcon } from './icons';

interface WeeklySummaryProps {
  transactions: Transaction[];
  stockItems: StockItem[];
}

interface SummaryData {
  itemId: string;
  itemName: string;
  totalWithdrawn: number;
  stockAtStartOfWeek: number;
  percentageUsed: number;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ transactions, stockItems }) => {
  const summaryData = useMemo<SummaryData[]>(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyTransactions = transactions.filter(t => t.timestamp >= sevenDaysAgo);
    
    const summaryMap = new Map<string, { totalWithdrawn: number; netChange: number; itemName: string }>();

    for (const trans of weeklyTransactions) {
      const entry = summaryMap.get(trans.itemId) || { totalWithdrawn: 0, netChange: 0, itemName: trans.itemName };
      
      if (trans.type === TransactionType.WITHDRAW) {
        entry.totalWithdrawn += trans.quantity;
        entry.netChange -= trans.quantity;
      } else if (trans.type === TransactionType.REFILL) {
        entry.netChange += trans.quantity;
      } else if (trans.type === TransactionType.ADD) {
        entry.netChange += trans.quantity;
      }
      entry.itemName = trans.itemName;
      summaryMap.set(trans.itemId, entry);
    }

    const result: SummaryData[] = [];
    for (const [itemId, data] of summaryMap.entries()) {
      if(data.totalWithdrawn === 0) continue;

      const currentItem = stockItems.find(item => item.id === itemId);
      const currentQuantity = currentItem ? currentItem.quantity : 0;
      
      const stockAtStartOfWeek = currentQuantity - data.netChange;

      let percentageUsed = 0;
      if (stockAtStartOfWeek > 0) {
        percentageUsed = (data.totalWithdrawn / stockAtStartOfWeek) * 100;
      } else if (data.totalWithdrawn > 0) {
        // If stock started at 0 and was used, it's 100% usage of what was added.
        const totalAddedThisWeek = weeklyTransactions
          .filter(t => t.itemId === itemId && (t.type === TransactionType.ADD || t.type === TransactionType.REFILL))
          .reduce((sum, t) => sum + t.quantity, 0);
        if (totalAddedThisWeek > 0) {
            percentageUsed = (data.totalWithdrawn / totalAddedThisWeek) * 100;
        }
      }

      result.push({
        itemId,
        itemName: data.itemName,
        totalWithdrawn: data.totalWithdrawn,
        stockAtStartOfWeek,
        percentageUsed: Math.min(100, percentageUsed) // Cap at 100%
      });
    }

    return result.sort((a, b) => b.totalWithdrawn - a.totalWithdrawn);
  }, [transactions, stockItems]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg sticky top-24">
      <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200 flex items-center">
        <ChartBarIcon className="h-6 w-6 mr-2 text-sky-500" />
        สรุปการใช้งานรายสัปดาห์
      </h2>
      {summaryData.length > 0 ? (
        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {summaryData.map(data => (
            <li key={data.itemId}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-600 dark:text-slate-300">{data.itemName}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  เบิกใช้ {data.totalWithdrawn} ชิ้น
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div 
                  className="bg-sky-500 h-2.5 rounded-full" 
                  style={{ width: `${data.percentageUsed}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">
                {data.percentageUsed.toFixed(1)}% ของสต็อกต้นสัปดาห์
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p>ไม่มีข้อมูลการเบิกจ่ายใน 7 วันที่ผ่านมา</p>
        </div>
      )}
    </div>
  );
};

export default WeeklySummary;
