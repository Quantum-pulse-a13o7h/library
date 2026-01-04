import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertBook } from "@shared/schema";
import { z } from "zod";

export function useBooks() {
  return useQuery({
    queryKey: [api.books.list.path],
    queryFn: async () => {
      const res = await fetch(api.books.list.path);
      if (!res.ok) throw new Error("Failed to fetch books");
      return api.books.list.responses[200].parse(await res.json());
    },
  });
}

export function useBook(id: number) {
  return useQuery({
    queryKey: [api.books.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.books.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch book");
      return api.books.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertBook) => {
      const validated = api.books.create.input.parse(data);
      const res = await fetch(api.books.create.path, {
        method: api.books.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to create book");
      return api.books.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.books.list.path] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.books.delete.path, { id });
      const res = await fetch(url, {
        method: api.books.delete.method,
      });
      if (!res.ok) throw new Error("Failed to delete book");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.books.list.path] });
    },
  });
}
