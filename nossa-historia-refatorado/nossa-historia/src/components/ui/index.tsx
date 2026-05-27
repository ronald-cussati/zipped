/**
 * components/ui/index.ts
 *
 * Design system barrel export.
 * All UI primitives follow a consistent visual language:
 *  - Rounded corners (rounded-xl / rounded-2xl)
 *  - Smooth transitions (150ms ease)
 *  - Focus rings for accessibility
 *  - Disabled states
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none'

  const variants = {
    primary:
      'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-200 hover:shadow-pink-300 hover:from-pink-600 hover:to-rose-700 focus-visible:ring-pink-500',
    secondary:
      'bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-400',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400',
    danger:
      'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-100 focus-visible:ring-red-500',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3.5',
  }

  return (
    <button
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border bg-white text-gray-900 text-sm',
            'border-gray-200 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent',
            'transition-all duration-150',
            'disabled:bg-gray-50 disabled:text-gray-400',
            error && 'border-red-400 focus:ring-red-400',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-gray-400">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border bg-white text-gray-900 text-sm resize-none',
            'border-gray-200 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent',
            'transition-all duration-150',
            error && 'border-red-400 focus:ring-red-400',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// ─── StepIndicator ────────────────────────────────────────────────────────────

interface StepIndicatorProps {
  steps: { label: string; icon: string }[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full overflow-x-auto px-2 py-4">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isActive = i === currentStep

        return (
          <React.Fragment key={step.label}>
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                  isCompleted
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-200'
                    : isActive
                    ? 'bg-white border-2 border-pink-500 text-pink-500 shadow-sm'
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                )}
              >
                {isCompleted ? '✓' : step.icon}
              </div>
              <span
                className={cn(
                  'text-[0.6rem] font-medium whitespace-nowrap',
                  isActive ? 'text-pink-600' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 sm:w-12 flex-shrink-0 mb-4 transition-all duration-300',
                  i < currentStep ? 'bg-pink-400' : 'bg-gray-200'
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
