
import React from 'react';
import { StockItem } from '../types';
import { HashtagIcon, CubeIcon, ExclamationTriangleIcon } from './icons';

interface DashboardMetricsProps {
  items: StockItem[];
}

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex items-center space-x-4">
    <div className={`rounded-full p-3 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ items }) => {
  const totalUniqueItems = items.length;
  const itemsWithLowStock = items.filter(item => 
    typeof item.lowStockThreshold === 'number' && item.quantity <= item.lowStockThreshold
  ).length;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <MetricCard
        icon={<HashtagIcon className="h-6 w-6 text-white" />}
        label="รายการสินค้าทั้งหมด"
        value={totalUniqueItems}
        color="bg-sky-500"
      />
      <MetricCard
        icon={<CubeIcon className="h-6 w-6 text-white" />}
        label="จำนวนสินค้าในคลัง"
        value={totalUnits.toLocaleString()}
        color="bg-emerald-500"
      />
      <MetricCard
        icon={<ExclamationTriangleIcon className="h-6 w-6 text-white" />}
        label="สินค้าใกล้หมด"
        value={itemsWithLowStock}
        color={itemsWithLowStock > 0 ? "bg-rose-500" : "bg-slate-500"}
      />
    </div>
  );
};

export default DashboardMetrics;
