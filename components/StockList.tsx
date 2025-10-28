
import React from 'react';
import { StockItem, TransactionType } from '../types';
import StockItemRow from './StockItemRow';

interface StockListProps {
  items: StockItem[];
  onUpdateQuantity: (itemId: string, type: TransactionType.REFILL | TransactionType.WITHDRAW, amount: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const StockList: React.FC<StockListProps> = ({ items, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">รายการสินค้าในคลัง</h2>
      <div className="overflow-x-auto">
        {items.length > 0 ? (
          <table className="w-full text-left">
            <thead className="border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400">ชื่อสินค้า</th>
                <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">คงเหลือ</th>
                <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 min-w-[300px]">จัดการสต็อก</th>
                <th className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <StockItemRow 
                  key={item.id} 
                  item={item} 
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="text-lg">ยังไม่มีสินค้าในคลัง</p>
            <p className="text-sm">เพิ่มสินค้าใหม่โดยใช้ฟอร์มด้านบน</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockList;
