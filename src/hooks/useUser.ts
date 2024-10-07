"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchUsers() {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}
export function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
}
