"use client";

import { useTasks } from "../hooks/useTasks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as Avatar from "@radix-ui/react-avatar";

export function NoData() {
  const { data: tasks, isLoading } = useTasks();

  if (isLoading || tasks?.length > 0) return null;

  return (
    <Alert className="flex items-center">
      <Avatar.Root className="mr-2 inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100">
        <Avatar.Fallback className="text-sm font-medium uppercase text-gray-800">
          NT
        </Avatar.Fallback>
      </Avatar.Root>
      <div>
        <AlertTitle>No tasks yet</AlertTitle>
        <AlertDescription>
          {"You haven't added any tasks. Please add a new task to get started."}
        </AlertDescription>
      </div>
    </Alert>
  );
}
