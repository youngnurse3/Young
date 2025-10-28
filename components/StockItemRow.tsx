
import React, { useState } from 'react';
import { StockItem, TransactionType } from '../types';
import { PlusIcon, MinusIcon, TrashIcon, ExclamationTriangleIcon, CogIcon, CheckIcon, XMarkIcon } from './icons';

interface StockItemRowProps {
  item: StockItem;
  onUpdateQuantity: (itemId: string, type: TransactionType.REFILL | TransactionType.WITHDRAW, amount: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSetThreshold: (itemId: string, threshold: number | undefined) => void;
}

const StockItemRow: React.FC<StockItemRowProps> = ({ item, onUpdateQuantity, onRemoveItem, onSetThreshold }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdValue, setThresholdValue] = useState(item.lowStockThreshold?.toString() ?? '');

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
    if(window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${item.name}" และประวัติทั้งหมดที่เกี่ยวข้อง? การดำเนินการนี้ไม่สามารถย้อนกลับได้`)){
      onRemoveItem(item.id);
    }
  }

  const handleSaveThreshold = () => {
    const numThreshold = parseInt(thresholdValue, 10);
    if (thresholdValue === '' || isNaN(numThreshold) || numThreshold < 0) {
      onSetThreshold(item.id, undefined);
    } else {
      onSetThreshold(item.id, numThreshold);
    }
    setIsEditingThreshold(false);
  };

  const handleCancelEditThreshold = () => {
    setThresholdValue(item.lowStockThreshold?.toString() ?? '');
    setIsEditingThreshold(false);
  };

  const numAmount = Number(amount);
  const isLowStock = typeof item.lowStockThreshold === 'number' && item.quantity <= item.lowStockThreshold;

  return (
    <tr className={`border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isLowStock ? 'bg-rose-50 dark:bg-rose-900/30' : ''}`}>
      <td className="p-4 font-medium text-slate-800 dark:text-slate-100">{item.name}</td>
      <td className="p-4 text-center">
        <span className={`font-bold text-lg ${isLowStock ? 'text-rose-500 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'}`}>
            {isLowStock && <ExclamationTriangleIcon aria-label="แจ้งเตือนสต็อกเหลือน้อย" className="h-4 w-4 inline-block mr-1.5 align-text-top" />}
            {item.quantity}
        </span>
        <div className="mt-1 h-8">
            {isEditingThreshold ? (
                 <div className="flex items-center justify-center space-x-1">
                    <input
                        type="number"
                        value={thresholdValue}
                        onChange={(e) => setThresholdValue(e.target.value)}
                        placeholder="จำนวน"
                        min="0"
                        className="w-20 bg-slate-100 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md p-1 text-center focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveThreshold()}
                    />
                    <button onClick={handleSaveThreshold} className="p-1 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400" aria-label="บันทึก">
                        <CheckIcon className="h-5 w-5" />
                    </button>
                    <button onClick={handleCancelEditThreshold} className="p-1 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400" aria-label="ยกเลิก">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
            ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center space-x-1 group">
                    {typeof item.lowStockThreshold === 'number' ? (
                        <span>แจ้งเตือน &lt;= {item.lowStockThreshold}</span>
                    ) : (
                        <span className="italic text-slate-400 dark:text-slate-500">ไม่มีแจ้งเตือน</span>
                    )}
                    <button onClick={() => setIsEditingThreshold(true)} className="text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label="ตั้งค่าการแจ้งเตือน">
                        <CogIcon className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
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
