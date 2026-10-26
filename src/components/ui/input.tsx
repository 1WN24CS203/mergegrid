import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full h-10 px-3 rounded-lg border text-sm',
            'bg-white text-neutral-900 placeholder-neutral-400',
            'border-neutral-300',
            'transition-colors duration-150',
            'hover:border-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
            icon && 'pl-10',
            error && 'border-error-500 focus:ring-error-500/20 focus:border-error-500',
            'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-error-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs text-neutral-500">{hint}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg border text-sm',
          'bg-white text-neutral-900 placeholder-neutral-400',
          'border-neutral-300',
          'transition-colors duration-150',
          'hover:border-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
          'resize-y min-h-[80px]',
          error && 'border-error-500 focus:ring-error-500/20 focus:border-error-500',
          'disabled:bg-neutral-50 disabled:text-neutral-400',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}
