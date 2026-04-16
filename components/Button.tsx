import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-300 ease-out font-medium tracking-wide focus:outline-none focus:ring-1 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-accent text-background hover:bg-accent/90 active:scale-[0.98] shadow-[0_10px_30px_rgba(216,144,67,0.18)]',
    outline: 'border border-foreground/20 text-foreground hover:border-accent/60 hover:bg-white/5 active:scale-[0.98]',
    ghost: 'text-foreground/80 hover:text-champagne hover:bg-white/5 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};
