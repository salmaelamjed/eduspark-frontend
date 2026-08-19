import { useState, useCallback } from "react";
import {
  ApiResponse,
} from "@/types/Admin.types";
import { useAuth } from "@/context/auth-context";

interface UseAdminBaseReturn {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  handleRequest: <T>(
    requestFn: (token: string) => Promise<ApiResponse<T>>,
  ) => Promise<T | null>;
  handleRequestWithParams: <T, P>(
    requestFn: (params: P, token: string) => Promise<ApiResponse<T>>,
    params: P,
  ) => Promise<T | null>;
  clearError: () => void;
}

export function useAdminBase(): UseAdminBaseReturn {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string[]
  > | null>(null);

  const handleRequest = useCallback(
    async <T>(
      requestFn: (token: string) => Promise<ApiResponse<T>>,
    ): Promise<T | null> => {
      if (!token) {
        setError("Authentication required");
        return null;
      }

      setIsLoading(true);
      setError(null);
      setValidationErrors(null);

      try {
        const response = await requestFn(token);

        if (response.success) {
          return response.data;
        } else {
          if ("errors" in response && response.errors) {
            setValidationErrors(response.errors);
            setError(response.message || "Validation error");
          } else {
            setError(response.message || "An error occurred");
          }
          return null;
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  );

  const handleRequestWithParams = useCallback(
    async <T, P>(
      requestFn: (params: P, token: string) => Promise<ApiResponse<T>>,
      params: P,
    ): Promise<T | null> => {
      if (!token) {
        setError("Authentication required");
        return null;
      }

      setIsLoading(true);
      setError(null);
      setValidationErrors(null);

      try {
        const response = await requestFn(params, token);

        if (response.success) {
          return response.data;
        } else {
          if ("errors" in response && response.errors) {
            setValidationErrors(response.errors);
            setError(response.message || "Validation error");
          } else {
            setError(response.message || "An error occurred");
          }
          return null;
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  );

  const clearError = useCallback(() => {
    setError(null);
    setValidationErrors(null);
  }, []);

  return {
    token,
    isLoading,
    error,
    validationErrors,
    handleRequest,
    handleRequestWithParams,
    clearError,
  };
}
