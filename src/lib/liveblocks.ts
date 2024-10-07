// lib/liveblocks.ts
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
});

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "done";
  priority: "low" | "medium" | "high";
  assigned?: string;
};

type Presence = {
  // You can keep cursor or other presence data if needed
};

type Storage = {
  tasks: Task[];
};

type UserMeta = {
  id: string;
  info: {
    name: string;
    picture: string;
  };
};

type RoomEvent = {
  type: "TASK_CREATED";
  task: Task;
};

export const {
  RoomProvider,
  useStorage,
  useMutation,
  useUpdateMyPresence,
  useSelf,
  useOthers,
  useEventListener,
  useBroadcastEvent,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
