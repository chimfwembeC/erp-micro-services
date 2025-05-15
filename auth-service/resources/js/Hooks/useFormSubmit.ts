import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { handleFormError } from '@/utils/formErrorHandler';
import { PermissionErrorOptions } from '@/utils/permissionErrorHandler';
import { toast } from 'sonner';

interface UseFormSubmitOptions extends PermissionErrorOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  successDescription?: string;
}

interface UseFormSubmitReturn<T, D> {
  data: T | null;
  loading: boolean;
  error: unknown;
  formErrors: Record<string, string[]>;
  submit: (formData: D, config?: AxiosRequestConfig) => Promise<AxiosResponse<T> | undefined>;
  reset: () => void;
  setFormErrors: (errors: Record<string, string[]>) => void;
  clearFormErrors: () => void;
  getFieldError: (field: string) => string | undefined;
}

/**
 * Custom hook for handling form submissions with built-in error handling
 * 
 * @param url - The URL to submit the form to
 * @param method - The HTTP method to use (default: 'POST')
 * @param options - Options for the form submission and error handling
 * @returns Object with data, loading state, error, submit function, and form error utilities
 */
function useFormSubmit<T = any, D = any>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options: UseFormSubmitOptions = {}
): UseFormSubmitReturn<T, D> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const {
    onSuccess,
    onError,
    successMessage = 'Success',
    successDescription = 'Operation completed successfully',
    ...errorOptions
  } = options;

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setFormErrors({});
  }, []);

  const clearFormErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return formErrors[field]?.[0];
    },
    [formErrors]
  );

  const submit = useCallback(
    async (formData: D, config?: AxiosRequestConfig) => {
      try {
        setLoading(true);
        setError(null);
        clearFormErrors();

        const response = await axios({
          url,
          method,
          data: formData,
          ...config,
        });

        setData(response.data);
        
        // Show success toast
        toast.success(successMessage, {
          description: successDescription,
        });
        
        onSuccess?.(response.data);
        return response;
      } catch (err) {
        // Handle form errors, including permission errors
        handleFormError(err, {
          ...errorOptions,
          setFormErrors,
        });
        
        setError(err);
        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    [url, method, onSuccess, onError, errorOptions, successMessage, successDescription, clearFormErrors]
  );

  return {
    data,
    loading,
    error,
    formErrors,
    submit,
    reset,
    setFormErrors,
    clearFormErrors,
    getFieldError,
  };
}

export default useFormSubmit;
