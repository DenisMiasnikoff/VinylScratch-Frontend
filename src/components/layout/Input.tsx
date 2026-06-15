'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-300"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={[
            'w-full rounded-lg bg-zinc-900 px-3.5 py-2.5 text-sm text-white',
            'border border-zinc-800 placeholder:text-zinc-500',
            'transition-colors duration-150',
            'focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/40',
            error ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30' : '',
            className,
          ].join(' ')}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
