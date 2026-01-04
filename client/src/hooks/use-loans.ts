import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertLoan } from "@shared/schema";

export function useLoans() {
  return useQuery({
    queryKey: [api.loans.list.path],
    queryFn: async () => {
      const res = await fetch(api.loans.list.path);
      if (!res.ok) throw new Error("Failed to fetch loans");
      return api.loans.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertLoan) => {
      const validated = api.loans.create.input.parse(data);
      const res = await fetch(api.loans.create.path, {
        method: api.loans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Failed to create loan");
        }
        throw new Error("Failed to create loan");
      }
      return api.loans.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.books.list.path] }); // Update availability
      queryClient.invalidateQueries({ queryKey: [api.loans.list.path] });
    },
  });
}

export function useReturnLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.loans.return.path, { id });
      const res = await fetch(url, {
        method: api.loans.return.method,
      });
      if (!res.ok) throw new Error("Failed to return book");
      return api.loans.return.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.books.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.loans.list.path] });
    },
  });
}
