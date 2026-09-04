import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md select-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2f81f7] disabled:opacity-50 disabled:cursor-not-allowed border text-xs sm:text-sm';

  const variantStyles = {
    primary:
      'bg-[#238636] text-white border-[#2ea043] hover:bg-[#2ea043] active:bg-[#238636] shadow-sm font-semibold',
    secondary:
      'bg-[#21262d] text-[#f0f6fc] border-[#30363d] hover:bg-[#30363d] hover:border-[#8b949e] active:bg-[#282e33] shadow-gh-sm',
    outline:
      'bg-transparent text-[#f0f6fc] border-[#30363d] hover:bg-[#21262d] hover:border-[#8b949e]',
    ghost:
      'bg-transparent text-[#8d96a0] border-transparent hover:bg-[#21262d] hover:text-[#f0f6fc]',
    danger:
      'bg-[#21262d] text-[#f85149] border-[#30363d] hover:bg-[#da3633] hover:text-white hover:border-[#da3633]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 h-7',
    md: 'text-xs sm:text-sm px-3.5 py-1.5 gap-2 h-8',
    lg: 'text-sm font-semibold px-4 py-2 gap-2 h-9',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
