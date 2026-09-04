import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Поиск по названию, автору или ISBN...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-3.5 h-3.5 text-[#8d96a0] absolute left-3 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-8 py-1.5 h-8 bg-[#0d1117] border border-[#30363d] rounded-md text-xs sm:text-sm text-[#f0f6fc] placeholder-[#8d96a0] focus:outline-none focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7] shadow-inner"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 p-0.5 text-[#8d96a0] hover:text-[#f0f6fc] rounded hover:bg-[#21262d]"
          title="Очистить"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
