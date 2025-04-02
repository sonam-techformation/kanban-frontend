import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import queryClient from "@/lib/react-query";

type ApiFunction<TData, TVariables> = (variables: TVariables) => Promise<TData>;

export const useApiMutation = <TData = unknown, TVariables = void>(
  apiFunction: ApiFunction<TData, TVariables>,
  queryKey: string[],
  options?: UseMutationOptions<TData, Error, TVariables>
): UseMutationResult<TData, Error, TVariables> => {
  return useMutation<TData, Error, TVariables>({
    mutationFn: apiFunction,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey });
      options?.onSuccess?.(data, variables, context); // Call custom onSuccess if provided
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context); // Call custom onError if provided
    },
    ...options,
  });
};
