
import React from 'react';
import { PackageIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-md backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center space-x-3">
          <PackageIcon className="h-8 w-8 text-sky-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            โปรแกรมจัดการสต็อก
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
