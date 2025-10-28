
import React, { useState } from 'react';
import { PlusIcon } from './icons';

interface AddItemFormProps {
  onAddItem: (name: string, quantity: number, lowStockThreshold?: number) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [threshold, setThreshold] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numQuantity = parseInt(quantity, 10);
    const numThreshold = threshold === '' ? undefined : parseInt(threshold, 10);
    
    if (name.trim() && !isNaN(numQuantity) && numQuantity >= 0) {
      onAddItem(name.trim(), numQuantity, numThreshold);
      setName('');
      setQuantity('');
      setThreshold('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">เพิ่มรายการสินค้าใหม่</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อสินค้า (เช่น: น้ำดื่ม)"
          className="md:col-span-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
          required
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="จำนวนเริ่มต้น"
          min="0"
          className="md:col-span-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
          required
        />
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          placeholder="แจ้งเตือนเมื่อต่ำกว่า"
          min="0"
          className="md:col-span-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
        />
        <button
          type="submit"
          className="md:col-span-1 flex items-center justify-center bg-sky-500 text-white font-semibold rounded-lg p-3 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 transition-colors duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
          disabled={!name.trim() || !quantity}
        >
          <PlusIcon className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">เพิ่ม</span>
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;