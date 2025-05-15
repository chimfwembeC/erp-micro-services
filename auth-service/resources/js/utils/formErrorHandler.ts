import axios from 'axios';
import { toast } from 'sonner';
import { handlePermissionError, PermissionErrorOptions } from './permissionErrorHandler';

interface FormErrorHandlerOptions extends PermissionErrorOptions {
  formErrors?: Record<string, string[]>;
  setFormErrors?: (errors: Record<string, string[]>) => void;
  onValidationError?: (errors: Record<string, string[]>) => void;
}

/**
 * Handle form submission errors, including permission errors and validation errors
 * 
 * @param error - The error object from axios
 * @param options - Options for handling the error
 * @returns The original error for further handling if needed
 */
export const handleFormError = (
  error: unknown,
  options: FormErrorHandlerOptions = {}
): unknown => {
  const {
    formErrors,
    setFormErrors,
    onValidationError,
    ...permissionOptions
  } = options;

  // First, handle permission errors (401, 403)
  handlePermissionError(error, {
    ...permissionOptions,
    // Don't show toast for validation errors, we'll handle those separately
    showToast: !isValidationError(error) && (permissionOptions.showToast ?? true),
  });

  // If it's not an axios error, just return it
  if (!axios.isAxiosError(error)) {
    return error;
  }

  // Handle validation errors (422)
  if (isValidationError(error)) {
    const validationErrors = error.response?.data?.errors || {};
    
    // Set form errors if a setter function was provided
    if (setFormErrors) {
      setFormErrors(validationErrors);
    }
    
    // Call the validation error callback if provided
    if (onValidationError) {
      onValidationError(validationErrors);
    }
    
    // Show a toast with the first validation error
    const firstErrorField = Object.keys(validationErrors)[0];
    if (firstErrorField && validationErrors[firstErrorField][0]) {
      toast.error('Validation Error', {
        description: validationErrors[firstErrorField][0],
      });
    }
  }

  return error;
};

/**
 * Check if an error is a validation error (422)
 * 
 * @param error - The error to check
 * @returns True if the error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;
  
  return error.response?.status === 422;
};

/**
 * Extract validation errors from an axios error
 * 
 * @param error - The axios error
 * @returns An object with field names as keys and error messages as values
 */
export const getValidationErrors = (error: unknown): Record<string, string[]> => {
  if (!isValidationError(error) || !axios.isAxiosError(error)) {
    return {};
  }
  
  return error.response?.data?.errors || {};
};

/**
 * Get the first validation error message for a specific field
 * 
 * @param errors - The validation errors object
 * @param field - The field name to get the error for
 * @returns The first error message for the field, or undefined if there are no errors
 */
export const getFieldError = (
  errors: Record<string, string[]>,
  field: string
): string | undefined => {
  return errors[field]?.[0];
};
