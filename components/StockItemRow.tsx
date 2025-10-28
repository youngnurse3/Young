
import React, { useState } from 'react';
import { StockItem, TransactionType } from '../types';
import { PlusIcon, MinusIcon, TrashIcon } from './icons';

interface StockItemRowProps {
  item: StockItem;
  onUpdateQuantity: (itemId: string, type: TransactionType.REFILL | TransactionType.WITHDRAW, amount: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const StockItemRow: React.FC<StockItemRowProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const [amount, setAmount] = useState<number | ''>('');

  const handleUpdate = (type: TransactionType.REFILL | TransactionType.WITHDRAW) => {
    const numAmount = Number(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      if (type === TransactionType.WITHDRAW && numAmount > item.quantity) {
        alert('จำนวนที่เบิกต้องไม่เกินจำนวนคงเหลือ');
        return;
      }
      onUpdateQuantity(item.id, type, numAmount);
      setAmount('');
    }
  };
  
  const handleRemove = () => {
    if(window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${item.name}" ออกจากสต็อก?`)){
      onRemoveItem(item.id);
    }
  }

  const numAmount = Number(amount);

  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td className="p-4 font-medium text-slate-800 dark:text-slate-100">{item.name}</td>
      <td className="p-4 text-center">
        <span className="font-bold text-lg text-slate-700 dark:text-slate-200">{item.quantity}</span>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            placeholder="จำนวน"
            min="1"
            className="w-24 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-center focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
          />
          <button
            onClick={() => handleUpdate(TransactionType.REFILL)}
            disabled={!amount || numAmount <= 0}
            className="flex-1 flex items-center justify-center bg-emerald-500 text-white font-semibold rounded-md p-2 hover:bg-emerald-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            aria-label={`เติม ${item.name}`}
          >
            <PlusIcon className="h-4 w-4 mr-1" /> เติม
          </button>
          <button
            onClick={() => handleUpdate(TransactionType.WITHDRAW)}
            disabled={!amount || numAmount <= 0 || numAmount > item.quantity}
            className="flex-1 flex items-center justify-center bg-rose-500 text-white font-semibold rounded-md p-2 hover:bg-rose-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            aria-label={`เบิก ${item.name}`}
          >
            <MinusIcon className="h-4 w-4 mr-1" /> เบิก
          </button>
        </div>
      </td>
      <td className="p-4 text-center">
        <button 
          onClick={handleRemove}
          className="text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-500 transition-colors"
          aria-label={`ลบ ${item.name}`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};

export default StockItemRow;
