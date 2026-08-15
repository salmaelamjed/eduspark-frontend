import { ApiError } from "@/lib/api";
import { useState, useCallback } from "react";
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";

interface UseApiMutationOptions<TInput extends FieldValues, TOutput> {
  mutationFn: (input: TInput) => Promise<TOutput>;
  setError?: UseFormSetError<TInput>;
  onSuccess?: (data: TOutput) => void;
}

interface MutationState {
  isPending: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

/**
 * Encapsule le cycle pending/success/error d'un appel API et, si un setError
 * de react-hook-form est fourni, remonte automatiquement chaque erreur de
 * validation Laravel (422, ApiError.errors) sur le bon champ du formulaire.
 */
export function useApiMutation<TInput extends FieldValues, TOutput>({
  mutationFn,
  setError,
  onSuccess,
}: UseApiMutationOptions<TInput, TOutput>) {
  const [state, setState] = useState<MutationState>({
    isPending: false,
    successMessage: null,
    errorMessage: null,
  });

  const mutate = useCallback(
    async (input: TInput) => {
      setState({ isPending: true, successMessage: null, errorMessage: null });

      try {
        const result = await mutationFn(input);
        const message =
          (result as { message?: string })?.message ?? "Opération réussie.";

        setState({
          isPending: false,
          successMessage: message,
          errorMessage: null,
        });
        onSuccess?.(result);
        return result;
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 422 && error.errors && setError) {
            for (const [field, messages] of Object.entries(error.errors)) {
              setError(field as Path<TInput>, { message: messages[0] });
            }
          }
          setState({
            isPending: false,
            successMessage: null,
            errorMessage: error.message,
          });
        } else {
          setState({
            isPending: false,
            successMessage: null,
            errorMessage: "Une erreur inattendue est survenue.",
          });
        }
        return null;
      }
    },
    [mutationFn, setError, onSuccess],
  );

  return { ...state, mutate };
}
