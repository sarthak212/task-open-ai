import { useQuery } from "@tanstack/react-query";

async function createTask(newTask: any) {
  const title = newTask.queryKey[1];
  const description = newTask.queryKey[2];
  const res = await fetch("/api/api-suggestion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      description: description,
    }),
  });
  if (!res.ok) throw new Error("Failed to create task");

  return res.json();
}

export function useOpenAI(body: { title?: string; description?: string }) {
  return useQuery({
    queryKey: ["openai", body.title, body.description || ""],
    queryFn: createTask,
    enabled: false,
    staleTime: 15 * 1000 * 60,
  });
}
