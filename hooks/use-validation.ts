"use client"

/**
 * React hooks for form validation
 */
import { useState, useCallback, useEffect } from "react"
import type { ValidationResult } from "@/lib/validation"

/**
 * Hook for managing field validation state
 */
export function useFieldValidation(
  validator: (value: any) => ValidationResult,
  initialValue: any = "",
  validateOnMount = false,
) {
  const [value, setValue] = useState(initialValue)
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  })
  const [hasBeenTouched, setHasBeenTouched] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  // Validate the current value
  const validate = useCallback(() => {
    setIsValidating(true)
    const result = validator(value)
    setValidationResult(result)
    setIsValidating(false)
    return result
  }, [value, validator])

  // Update value and trigger validation if field has been touched
  const updateValue = useCallback(
    (newValue: any) => {
      setValue(newValue)
      if (hasBeenTouched) {
        // Slight delay to prevent validation while user is typing
        setTimeout(() => {
          setIsValidating(true)
          const result = validator(newValue)
          setValidationResult(result)
          setIsValidating(false)
        }, 300)
      }
    },
    [hasBeenTouched, validator],
  )

  // Mark field as touched (usually on blur)
  const markAsTouched = useCallback(() => {
    if (!hasBeenTouched) {
      setHasBeenTouched(true)
      validate()
    }
  }, [hasBeenTouched, validate])

  // Force validation (usually on form submit)
  const forceValidation = useCallback(() => {
    setHasBeenTouched(true)
    return validate()
  }, [validate])

  // Reset field state
  const reset = useCallback(
    (newValue: any = initialValue) => {
      setValue(newValue)
      setHasBeenTouched(false)
      setValidationResult({ isValid: true, errors: [] })
      setIsValidating(false)
    },
    [initialValue],
  )

  // Validate on mount if requested
  useEffect(() => {
    if (validateOnMount) {
      validate()
    }
  }, [validateOnMount, validate])

  return {
    value,
    setValue: updateValue,
    validationResult,
    hasBeenTouched,
    isValidating,
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    markAsTouched,
    forceValidation,
    reset,
  }
}

/**
 * Hook for managing form validation state
 */
export function useFormValidation<T extends Record<string, any>>(
  validators: Record<keyof T, (value: any) => ValidationResult>,
  initialValues: T,
) {
  const [values, setValues] = useState<T>(initialValues)
  const [validationResults, setValidationResults] = useState<Record<keyof T, ValidationResult>>(
    Object.keys(validators).reduce(
      (acc, key) => {
        acc[key as keyof T] = { isValid: true, errors: [] }
        return acc
      },
      {} as Record<keyof T, ValidationResult>,
    ),
  )
  const [touchedFields, setTouchedFields] = useState<Record<keyof T, boolean>>(
    Object.keys(validators).reduce(
      (acc, key) => {
        acc[key as keyof T] = false
        return acc
      },
      {} as Record<keyof T, boolean>,
    ),
  )

  // Update a specific field value
  const updateField = useCallback(
    (fieldName: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }))

      // If field has been touched, validate immediately with debounce
      if (touchedFields[fieldName]) {
        setTimeout(() => {
          const validator = validators[fieldName]
          if (validator) {
            const result = validator(value)
            setValidationResults((prev) => ({ ...prev, [fieldName]: result }))
          }
        }, 300)
      }
    },
    [validators, touchedFields],
  )

  // Mark a field as touched
  const markFieldAsTouched = useCallback(
    (fieldName: keyof T) => {
      if (!touchedFields[fieldName]) {
        setTouchedFields((prev) => ({ ...prev, [fieldName]: true }))

        // Validate the field now that it's touched
        const validator = validators[fieldName]
        if (validator) {
          const result = validator(values[fieldName])
          setValidationResults((prev) => ({ ...prev, [fieldName]: result }))
        }
      }
    },
    [touchedFields, validators, values],
  )

  // Validate all fields (usually on form submit)
  const validateAllFields = useCallback(() => {
    const newValidationResults = {} as Record<keyof T, ValidationResult>
    const newTouchedFields = {} as Record<keyof T, boolean>

    let isFormValid = true

    Object.keys(validators).forEach((key) => {
      const fieldName = key as keyof T
      const validator = validators[fieldName]
      const result = validator(values[fieldName])

      newValidationResults[fieldName] = result
      newTouchedFields[fieldName] = true

      if (!result.isValid) {
        isFormValid = false
      }
    })

    setValidationResults(newValidationResults)
    setTouchedFields(newTouchedFields)

    return {
      isValid: isFormValid,
      results: newValidationResults,
      errors: Object.values(newValidationResults).flatMap((result) => result.errors),
    }
  }, [validators, values])

  // Reset form
  const resetForm = useCallback(
    (newValues: T = initialValues) => {
      setValues(newValues)
      setValidationResults(
        Object.keys(validators).reduce(
          (acc, key) => {
            acc[key as keyof T] = { isValid: true, errors: [] }
            return acc
          },
          {} as Record<keyof T, ValidationResult>,
        ),
      )
      setTouchedFields(
        Object.keys(validators).reduce(
          (acc, key) => {
            acc[key as keyof T] = false
            return acc
          },
          {} as Record<keyof T, boolean>,
        ),
      )
    },
    [validators, initialValues],
  )

  // Get validation state for a specific field
  const getFieldState = useCallback(
    (fieldName: keyof T) => {
      return {
        value: values[fieldName],
        isValid: validationResults[fieldName]?.isValid ?? true,
        errors: validationResults[fieldName]?.errors ?? [],
        hasBeenTouched: touchedFields[fieldName] ?? false,
      }
    },
    [values, validationResults, touchedFields],
  )

  // Check if form is valid
  const isFormValid = Object.values(validationResults).every((result) => result.isValid)

  // Get all errors
  const allErrors = Object.values(validationResults).flatMap((result) => result.errors)

  return {
    values,
    updateField,
    markFieldAsTouched,
    validateAllFields,
    resetForm,
    getFieldState,
    isFormValid,
    allErrors,
    validationResults,
    touchedFields,
    getFieldErrors: useCallback(
      (fieldName: keyof T) => {
        return validationResults[fieldName]?.errors ?? []
      },
      [validationResults],
    ),
    isFieldValid: useCallback(
      (fieldName: keyof T) => {
        return validationResults[fieldName]?.isValid ?? true
      },
      [validationResults],
    ),
    isFieldTouched: useCallback(
      (fieldName: keyof T) => {
        return touchedFields[fieldName] ?? false
      },
      [touchedFields],
    ),
    touchField: useCallback(
      (fieldName: keyof T) => {
        markFieldAsTouched(fieldName)
      },
      [markFieldAsTouched],
    ),
  }
}
