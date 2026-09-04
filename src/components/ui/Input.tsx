import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-[#f0f6fc] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#8d96a0] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-md bg-[#0d1117] border text-xs sm:text-sm text-[#f0f6fc] placeholder-[#8d96a0]
              ${leftIcon ? 'pl-8' : 'pl-3'}
              ${rightIcon ? 'pr-8' : 'pr-3'}
              py-1.5 h-8
              ${error ? 'border-[#f85149] focus:border-[#f85149] focus:ring-1 focus:ring-[#f85149]' : 'border-[#30363d] focus:border-[#2f81f7] focus:ring-1 focus:ring-[#2f81f7]'}
              focus:outline-none
              disabled:bg-[#161b22] disabled:text-[#6e7681] disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#8d96a0] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-[#f85149]">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-[#8d96a0]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
