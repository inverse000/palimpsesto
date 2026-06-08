import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm text-ivory-400 font-serif">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full px-3 py-2 rounded text-sm font-serif',
            'bg-carbon-800 border text-ivory-200 placeholder-carbon-500',
            'transition-colors duration-150',
            error
              ? 'border-red-700/60 focus:border-red-500'
              : 'border-carbon-600 focus:border-bronze-500',
            'outline-none',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-serif">{error}</p>}
        {hint && !error && <p className="text-xs text-ivory-500 font-serif">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
