"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchTasks() {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

interface TaskInterface {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  userid?: string[];
  tags?: string[];
  project?: string;
}

async function updateTask({ id, data }: { id: string; data: TaskInterface }) {
  const res = await fetch(`/api/update-task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id,
      data: data,
    }),
  });
  if (!res.ok) throw new Error("Failed to update task");

  return res.json();
}

async function createTask(newTask: TaskInterface) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });
  if (!res.ok) throw new Error("Failed to create task");

  return res.json();
}

export function useTasks() {
  return useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
