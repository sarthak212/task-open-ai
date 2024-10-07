// hooks/useTasks.ts
import { useMutation, useStorage, useBroadcastEvent } from "@/lib/liveblocks";

export function useLiveBlockTasks() {
  const tasks = useStorage((root) => root.tasks);
  const broadcast = useBroadcastEvent();

  const createTask = useMutation(({ storage }, newTask) => {
    const tasksArray = storage.get("tasks");
    const existingTaskIndex = tasksArray.findIndex(
      (task) => task.id === newTask.id
    );

    if (existingTaskIndex === -1) {
      // Task doesn't exist, so create it
      storage.set("tasks", [...tasksArray, newTask]);
    } else {
      // Task exists, so modify it
      const updatedTasks = tasksArray.map((task) =>
        task.id === newTask.id ? { ...task, ...newTask } : task
      );
      storage.set("tasks", updatedTasks);
    }
    broadcast({ type: "TASK_CREATED", task: newTask });
  }, []);

  return {
    tasks,
    createTask,
  };
}
