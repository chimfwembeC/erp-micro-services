import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { handlePermissionError, PermissionErrorOptions } from '@/utils/permissionErrorHandler';

interface UseApiOptions extends PermissionErrorOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: unknown) => void;
  autoFetch?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
  fetch: (config?: AxiosRequestConfig) => Promise<AxiosResponse<T> | undefined>;
  reset: () => void;
}

/**
 * Custom hook for making API requests with built-in error handling
 * 
 * @param url - The URL to fetch
 * @param options - Options for the API request and error handling
 * @returns Object with data, loading state, error, fetch function, and reset function
 */
function useApi<T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const {
    onSuccess,
    onError,
    autoFetch = false,
    ...errorOptions
  } = options;

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  const fetch = useCallback(
    async (config?: AxiosRequestConfig) => {
      try {
        setLoading(true);
        setError(null);

        // Try the main API endpoint
        const response = await axios({
          url,
          method: 'GET',
          ...config,
        });

        setData(response.data);
        onSuccess?.(response.data);
        return response;
      } catch (err) {
        // Handle permission errors
        handlePermissionError(err, errorOptions);
        
        setError(err);
        onError?.(err);
        
        // Try fallback web route if it's a permission error
        if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
          try {
            // Convert API route to web route (e.g., /api/roles to /web-roles)
            const webUrl = url.replace('/api/', '/web-');
            
            const fallbackResponse = await axios({
              url: webUrl,
              method: 'GET',
              ...config,
            });
            
            setData(fallbackResponse.data);
            setError(null);
            onSuccess?.(fallbackResponse.data);
            return fallbackResponse;
          } catch (fallbackErr) {
            // If fallback also fails, handle that error too
            handlePermissionError(fallbackErr, {
              ...errorOptions,
              showToast: false, // Don't show another toast for the fallback
            });
            
            setError(fallbackErr);
            onError?.(fallbackErr);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [url, onSuccess, onError, errorOptions]
  );

  // Auto fetch on mount if enabled
  useState(() => {
    if (autoFetch) {
      fetch();
    }
  });

  return { data, loading, error, fetch, reset };
}

export default useApi;
