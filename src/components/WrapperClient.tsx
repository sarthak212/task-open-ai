"use client";

import { DataTable } from "../components/ui/DataTable";
import { UserNav } from "../components/navbar";
import { CreateTask } from "@/components/createtask";
import { RoomProvider } from "@/lib/liveblocks";

export function WrapperClient() {
  return (
    <RoomProvider id="tasks-room" initialStorage={{ tasks: [] }}>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <CreateTask />
            <UserNav />
          </div>
        </div>
        <DataTable />
      </div>
    </RoomProvider>
  );
}
