/**
 * Validated Input Component
 * Wraps the base Input component with validation display
 */
import React, { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ValidatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  label?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  errors?: string[]
  isValid?: boolean
  hasBeenTouched?: boolean
  isValidating?: boolean
  helperText?: string
  showValidationIcon?: boolean
  required?: boolean
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  (
    {
      label,
      value,
      onChange,
      onBlur,
      errors = [],
      isValid = true,
      hasBeenTouched = false,
      isValidating = false,
      helperText,
      showValidationIcon = true,
      required = false,
      className,
      ...props
    },
    ref
  ) => {
    const showErrors = hasBeenTouched && !isValid && errors.length > 0
    const showSuccess = hasBeenTouched && isValid && !isValidating

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-foreground font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <div className="relative">
          <Input
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={cn(
              "input-3d",
              showErrors && "border-destructive focus:border-destructive",
              showSuccess && "border-green-500 focus:border-green-500",
              showValidationIcon && (showErrors || showSuccess) && "pr-10",
              className
            )}
            {...props}
          />
          
          {showValidationIcon && (showErrors || showSuccess) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {showErrors && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              {showSuccess && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
          )}
        </div>

        {/* Helper text or validation messages */}
        <div className="min-h-[1.25rem]">
          {showErrors ? (
            <div className="space-y-1">
              {errors.map((error: string, index: number) => (
                <p key={index} className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </p>
              ))}
            </div>
          ) : helperText ? (
            <p className="text-sm text-muted-foreground">{helperText}</p>
          ) : null}
        </div>

        {isValidating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            Validating...
          </div>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'
